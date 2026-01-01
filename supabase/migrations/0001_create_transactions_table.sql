-- 1. Crear la tabla de transacciones
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Comentarios para explicar las columnas
COMMENT ON COLUMN public.transactions.id IS 'Identificador único para cada transacción';
COMMENT ON COLUMN public.transactions.user_id IS 'Vincula la transacción a un usuario de Supabase Auth';
COMMENT ON COLUMN public.transactions.type IS 'Tipo de transacción (ej: "income" o "expense")';
COMMENT ON COLUMN public.transactions.category IS 'Categoría de la transacción (ej: "Comida", "Transporte")';
COMMENT ON COLUMN public.transactions.amount IS 'Monto de la transacción, siempre positivo';
COMMENT ON COLUMN public.transactions.date IS 'Fecha en que ocurrió la transacción';
COMMENT ON COLUMN public.transactions.description IS 'Descripción opcional de la transacción';
COMMENT ON COLUMN public.transactions.created_at IS 'Fecha de creación del registro';

-- 2. Habilitar la Seguridad a Nivel de Fila (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 3. Crear las Políticas de Seguridad
-- Política para SELECT: Los usuarios solo pueden ver sus propias transacciones.
CREATE POLICY "users_can_select_own_transactions"
ON public.transactions FOR SELECT
USING (auth.uid() = user_id);

-- Política para INSERT: Los usuarios pueden crear transacciones para sí mismos.
CREATE POLICY "users_can_insert_own_transactions"
ON public.transactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE: Los usuarios solo pueden actualizar sus propias transacciones.
CREATE POLICY "users_can_update_own_transactions"
ON public.transactions FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para DELETE: Los usuarios solo pueden borrar sus propias transacciones.
CREATE POLICY "users_can_delete_own_transactions"
ON public.transactions FOR DELETE
USING (auth.uid() = user_id);

-- 4. (Opcional) Crear un índice para mejorar el rendimiento de las búsquedas por usuario.
CREATE INDEX ON public.transactions (user_id);

-- 5. (Opcional) Notificar a PostgREST sobre los cambios en el esquema.
NOTIFY pgrst, 'reload schema';
