import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

interface ComplianceRecord {
  date_recorded: string;
  result: number;
  metric: string;
}

interface Props {
  records: ComplianceRecord[];
}

function ComplianceChart({ records }: Props) {
  const data = records.map(record => ({
    date: format(new Date(record.date_recorded), 'MMM d'),
    value: record.result,
    metric: record.metric
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 shadow-md rounded-md border">
                    <p className="text-sm font-medium">{payload[0].payload.metric}</p>
                    <p className="text-sm text-gray-500">
                      Value: {payload[0].value}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ fill: '#4f46e5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComplianceChart;