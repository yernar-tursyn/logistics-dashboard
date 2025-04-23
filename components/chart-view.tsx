"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ChartViewProps {
  data: any;
}

export default function ChartView({ data }: ChartViewProps) {
  const [chartType, setChartType] = useState("status");
  const [timeRange, setTimeRange] = useState("week");

  const getStatusData = () => {
    const statusCounts: Record<string, number> = {};

    Object.keys(data).forEach((columnKey) => {
      data[columnKey].rows.forEach((row: any) => {
        if (!statusCounts[row.status]) {
          statusCounts[row.status] = 0;
        }
        statusCounts[row.status]++;
      });
    });

    return Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }));
  };

  const getColumnComparisonData = () => {
    return Object.keys(data).map((columnKey) => {
      const column = data[columnKey];
      const statusCounts: Record<string, number> = {};

      column.rows.forEach((row: any) => {
        if (!statusCounts[row.status]) {
          statusCounts[row.status] = 0;
        }
        statusCounts[row.status]++;
      });

      const result: any = {
        name: getColumnName(columnKey),
      };

      result.обеспечен = statusCounts["обеспечен"] || 0;
      result.необеспечен = statusCounts["не обеспечен, по ограничениям"] || 0;
      result.корректировка =
        (statusCounts["обеспечен с корректировкой"] || 0) +
        (statusCounts["обеспечен, с корректировкой по ограничениям"] || 0);

      return result;
    });
  };

  const getTimeData = () => {
    const days = timeRange === "week" ? 7 : 30;
    const result = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      result.unshift({
        date: date.toLocaleDateString("ru-RU"),
        обеспечен: Math.floor(Math.random() * 10) + 5,
        необеспечен: Math.floor(Math.random() * 8) + 2,
        корректировка: Math.floor(Math.random() * 6) + 1,
      });
    }

    return result;
  };

  const getColumnName = (columnKey: string) => {
    switch (columnKey) {
      case "demand":
        return "Спрос";
      case "optimizerPlan":
        return "План оптимизатора";
      case "projectPlan":
        return "Проект плана";
      case "approvedPlan":
        return "Согласованный план";
      case "execution":
        return "Факт исполнения";
      default:
        return columnKey;
    }
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#b1053d",
    "#82ca9d",
    "#ff7300",
  ];

  const statusData = getStatusData();
  const columnData = getColumnComparisonData();
  const timeData = getTimeData();

  return (
    <div className="h-full p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">Аналитика и графики</h2>

        <div className="flex gap-2">
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Тип графика" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">Распределение статусов</SelectItem>
              <SelectItem value="columns">Сравнение колонок</SelectItem>
              <SelectItem value="time">Временная динамика</SelectItem>
            </SelectContent>
          </Select>

          {chartType === "time" && (
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Период" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Неделя</SelectItem>
                <SelectItem value="month">Месяц</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="grid h-[calc(100%-3rem)] gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-4 text-lg font-medium">
            {chartType === "status" && "Распределение статусов"}
            {chartType === "columns" && "Сравнение колонок"}
            {chartType === "time" && "Временная динамика"}
          </h3>

          <div className="h-[calc(100%-2rem)]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "status" ? (
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : chartType === "columns" ? (
                <BarChart
                  data={columnData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="обеспечен" fill="#00C49F" />
                  <Bar dataKey="необеспечен" fill="#FF8042" />
                  <Bar dataKey="корректировка" fill="#FFBB28" />
                </BarChart>
              ) : (
                <BarChart
                  data={timeData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="обеспечен" fill="#00C49F" />
                  <Bar dataKey="необеспечен" fill="#FF8042" />
                  <Bar dataKey="корректировка" fill="#FFBB28" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <Tabs defaultValue="status">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Дополнительная аналитика</h3>
              <TabsList>
                <TabsTrigger value="status">Статусы</TabsTrigger>
                <TabsTrigger value="wagons">Вагоны</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="status" className="h-[calc(100%-3rem)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={statusData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#b1053d" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="wagons" className="h-[calc(100%-3rem)]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Распределены", value: 18 },
                      { name: "Не распределены", value: 7 },
                      { name: "В пути", value: 12 },
                      { name: "На погрузке", value: 5 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
