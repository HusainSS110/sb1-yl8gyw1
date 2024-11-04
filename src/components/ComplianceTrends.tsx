import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface Supplier {
  id: number;
  name: string;
  compliance_score: number;
}

interface Props {
  suppliers: Supplier[];
}

function ComplianceTrends({ suppliers }: Props) {
  const data = suppliers.map(supplier => ({
    name: supplier.name,
    score: supplier.compliance_score
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 shadow-md rounded-md border">
                    <p className="text-sm font-medium">{payload[0].payload.name}</p>
                    <p className="text-sm text-gray-500">
                      Score: {payload[0].value}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComplianceTrends;