import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ExpenseChartProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  'hsl(38 92% 50%)',
  'hsl(200 80% 50%)',
  'hsl(280 70% 60%)',
  'hsl(45 90% 50%)',
  'hsl(0 72% 51%)',
  'hsl(320 70% 55%)',
  'hsl(180 60% 45%)',
  'hsl(220 14% 40%)',
];

export function ExpenseChart({ data }: ExpenseChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-4">Gastos por Categoría</h3>
      
      {data.length > 0 ? (
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(220 18% 10%)',
                    border: '1px solid hsl(220 13% 18%)',
                    borderRadius: '0.75rem',
                    color: 'hsl(210 40% 98%)',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-2">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-muted-foreground truncate">
                  {item.name}
                </span>
                <span className="text-sm font-medium ml-auto">
                  {total > 0 ? Math.round((item.value / total) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No hay gastos registrados</p>
        </div>
      )}
    </div>
  );
}
