import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient, ObjectId } from "npm:mongodb@6.3.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MONGODB_PASSWORD = Deno.env.get('MONGODB_PASSWORD');
const MONGODB_URI = `mongodb+srv://JuanPiece:${MONGODB_PASSWORD}@datos-aplicacion.f9afopl.mongodb.net/?retryWrites=true&w=majority&appName=datos-aplicacion`;
const DATABASE_NAME = 'finanzas_app';
const COLLECTION_NAME = 'transactions';

let client: MongoClient | null = null;

async function getCollection() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
  }
  return client.db(DATABASE_NAME).collection(COLLECTION_NAME);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    console.log(`MongoDB API called with action: ${action}`);

    const collection = await getCollection();
    let result;

    switch (action) {
      case 'getTransactions':
        const transactions = await collection
          .find({})
          .sort({ date: -1 })
          .limit(100)
          .toArray();
        result = { documents: transactions.map(doc => ({ ...doc, _id: doc._id.toString() })) };
        break;

      case 'addTransaction':
        const insertResult = await collection.insertOne({
          ...data,
          date: new Date(data.date),
          createdAt: new Date(),
        });
        result = { insertedId: insertResult.insertedId.toString() };
        break;

      case 'deleteTransaction':
        await collection.deleteOne({ _id: new ObjectId(data.id) });
        result = { success: true };
        break;

      case 'updateTransaction':
        await collection.updateOne(
          { _id: new ObjectId(data.id) },
          { $set: { ...data.updates, updatedAt: new Date() } }
        );
        result = { success: true };
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log(`MongoDB operation ${action} completed successfully`);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in mongodb-api function:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
