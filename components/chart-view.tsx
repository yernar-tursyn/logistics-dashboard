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
  Sector,
} from "recharts";
import type {
  ChartViewProps,
  StatusChartData,
  ColumnChartData,
  TimeChartData,
  RowData,
} from "@/types";
import type React from "react";

interface PieSectorProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: {
    name: string;
    value: number;
  };
  percent: number;
  value: number;
}

export default function ChartView({ data }: ChartViewProps) {
  const [chartType, setChartType] = useState("status");
  const [timeRange, setTimeRange] = useState("week");
  const [activeIndex, setActiveIndex] = useState(-1);

  const getStatusData = (): StatusChartData[] => {
    const statusCounts: Record<string, number> = {};

    Object.keys(data).forEach((columnKey) => {
      data[columnKey as keyof typeof data].rows.forEach((row: RowData) => {
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

  const getColumnComparisonData = (): ColumnChartData[] => {
    return Object.keys(data).map((columnKey) => {
      const column = data[columnKey as keyof typeof data];
      const statusCounts: Record<string, number> = {};

      column.rows.forEach((row: RowData) => {
        if (!statusCounts[row.status]) {
          statusCounts[row.status] = 0;
        }
        statusCounts[row.status]++;
      });

      const result: ColumnChartData = {
        name: getColumnName(columnKey),
        обеспечен: statusCounts["обеспечен"] || 0,
        необеспечен: statusCounts["не обеспечен, по ограничениям"] || 0,
        корректировка:
          (statusCounts["обеспечен с корректировкой"] || 0) +
          (statusCounts["обеспечен, с корректировкой по ограничениям"] || 0),
      };

      return result;
    });
  };

  const getTimeData = (): TimeChartData[] => {
    const days = timeRange === "week" ? 7 : 30;
    const result: TimeChartData[] = [];

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

  const getColumnName = (columnKey: string): string => {
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

  const shortenStatusName = (name: string): string => {
    const map: Record<string, string> = {
      "обеспечен, с корректировкой по ограничениям": "обеспечен с корр.",
      "не обеспечен, по ограничениям": "не обеспечен",
      "выгрузка +3, плановая": "выгрузка +3",
      "обеспечен с корректировкой": "обеспечен с корр.",
      "обеспечен 3 из 10": "обеспечен 3/10",
    };
    return map[name] || name;
  };

  const renderActiveShape = (props: PieSectorProps) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <text
          x={cx}
          y={cy - 15}
          dy={8}
          textAnchor="middle"
          fill="#333"
          fontSize={14}
          fontWeight="bold"
        >
          {shortenStatusName(payload.name)}
        </text>
        <text
          x={cx}
          y={cy + 15}
          dy={8}
          textAnchor="middle"
          fill="#333"
          fontSize={14}
        >
          {`${value} (${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    );
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

  const onPieEnter = (_: React.MouseEvent<SVGElement>, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <div className="h-full p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">Аналитика и графики</h2>

        <div className="flex gap-2">
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-auto min-w-[180px]">
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
              <SelectTrigger className="w-auto min-w-[120px]">
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

      <div className="grid h-[calc(100%-3rem)] gap-3 lg:grid-cols-2">
        <Card className="p-3 overflow-hidden flex flex-col">
          <h3 className="mb-2 text-lg font-medium">
            {chartType === "status" && "Распределение статусов"}
            {chartType === "columns" && "Сравнение колонок"}
            {chartType === "time" && "Временная динамика"}
          </h3>

          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "status" ? (
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    // @ts-expect-error
                    activeShape={renderActiveShape}
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                    label={({ name, percent }) =>
                      activeIndex === -1
                        ? `${shortenStatusName(name)}: ${(
                            percent * 100
                          ).toFixed(0)}%`
                        : ""
                    }
                    labelLine={activeIndex === -1}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      shortenStatusName(name as string),
                    ]}
                  />
                  <Legend formatter={(value) => shortenStatusName(value)} />
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

        <Card className="p-3 overflow-hidden flex flex-col">
          <Tabs defaultValue="status" className="flex-1 flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-medium">Дополнительная аналитика</h3>
              <TabsList>
                <TabsTrigger value="status">Статусы</TabsTrigger>
                <TabsTrigger value="wagons">Вагоны</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="status" className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={statusData.map((item) => ({
                    ...item,
                    name: shortenStatusName(item.name),
                  }))}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 100,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#b1053d" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="wagons" className="flex-1 min-h-[300px]">
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
                    innerRadius={60}
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
