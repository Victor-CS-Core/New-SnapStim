import { Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartCardProps {
  title: string;
  description: string;
  chartType: "line" | "bar" | "pie" | "progress";
  data: any;
}

export default function ChartCard({
  title,
  description,
  chartType,
  data,
}: ChartCardProps) {
  const handleExportPNG = () => {
    console.log("Exporting chart as PNG");
  };

  const handleExportCSV = () => {
    console.log("Exporting chart data as CSV");
  };

  const renderChart = () => {
    switch (chartType) {
      case "line":
        // Transform data for recharts
        const lineChartData = data.labels.map((label: string, idx: number) => {
          const point: any = { name: label };
          data.datasets.forEach((dataset: any) => {
            point[dataset.label] = dataset.data[idx];
          });
          return point;
        });

        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-stone-200 dark:stroke-stone-700" />
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fill: "currentColor" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "currentColor" }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              {data.datasets.map((dataset: any, idx: number) => (
                <Line
                  key={idx}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={dataset.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        const barChartData = data.labels.map((label: string, idx: number) => ({
          name: label,
          value: data.datasets[0].data[idx],
        }));

        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-stone-200 dark:stroke-stone-700" />
              <XAxis
                dataKey="name"
                className="text-xs"
                tick={{ fill: "currentColor" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "currentColor" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="value" fill={data.datasets[0].color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        const pieChartData = data.labels.map((label: string, idx: number) => ({
          name: label,
          value: data.data[idx],
        }));

        return (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={data.colors[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {data.labels.map((label: string, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: data.colors[i] }}
                    ></div>
                    <span className="text-sm text-stone-700 dark:text-stone-300">
                      {label}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    {data.data[i]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "progress":
        return (
          <div className="space-y-3">
            {data.programs.map((program: any, i: number) => {
              const statusColors = {
                mastered: "bg-emerald-600",
                close: "bg-amber-500",
                "in-progress": "bg-blue-500",
              };
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-700 dark:text-stone-300">
                      {program.name}
                    </span>
                    <span className="text-stone-900 dark:text-stone-100 font-medium">
                      {program.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${statusColors[program.status as keyof typeof statusColors]} rounded-full`}
                      style={{ width: `${program.progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };
            </div>
            <div className="space-y-2">
              {data.labels.map((label: string, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: data.colors[i] }}
                    ></div>
                    <span className="text-sm text-stone-700 dark:text-stone-300">
                      {label}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    {data.data[i]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case "progress":
        return (
          <div className="space-y-3">
            {data.programs.map((program: any, i: number) => {
              const statusColors = {
                mastered: "bg-emerald-600",
                close: "bg-amber-500",
                "in-progress": "bg-blue-500",
              };
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-700 dark:text-stone-300">
                      {program.name}
                    </span>
                    <span className="text-stone-900 dark:text-stone-100 font-medium">
                      {program.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${statusColors[program.status as keyof typeof statusColors]} rounded-full`}
                      style={{ width: `${program.progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              {description}
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportPNG}
              title="Export as PNG"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportCSV}
              title="Export data as CSV"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
}
