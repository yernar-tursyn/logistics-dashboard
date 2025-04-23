"use client";

import { useState } from "react";
import { mockData } from "@/lib/mock-data";
import AppHeader from "@/components/app-header";
import ColumnView from "@/components/column-view";
import ComparisonModal from "@/components/comparison-modal";
import DetailedView from "@/components/detailed-view";
import ExpandedColumnView from "@/components/expanded-column-view";
import ChartView from "@/components/chart-view";
import MapView from "@/components/map-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, FileSpreadsheet, BarChart3, Map } from "lucide-react";
import type { ColumnId, ColumnItem, LogisticsData, RowData } from "@/types";

export default function LogisticsApp() {
  const [data, setData] = useState<LogisticsData>(mockData);
  const [activeView, setActiveView] = useState("columns");
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonSource, setComparisonSource] = useState<ColumnId | "">("");
  const [comparisonTarget, setComparisonTarget] = useState<ColumnId | "">("");
  const [detailedItem, setDetailedItem] = useState<RowData | null>(null);
  const [expandedColumn, setExpandedColumn] = useState<ColumnId | null>(null);

  const handleAcceptItem = (
    columnId: ColumnId,
    rowId: string,
    action: string
  ) => {
    const newData = JSON.parse(JSON.stringify(data)) as LogisticsData;

    const sourceColumn = columnId;
    const targetColumn = "projectPlan" as ColumnId;

    const sourceRow = newData[sourceColumn].rows.find(
      (row: RowData) => row.id === rowId
    );
    if (!sourceRow) return;

    if (action === "acceptRequest") {
      const targetRowIndex = newData[targetColumn].rows.findIndex(
        (row: RowData) => row.id === rowId
      );

      if (targetRowIndex >= 0) {
        newData[targetColumn].rows[targetRowIndex] = {
          ...sourceRow,
          status: sourceRow.status,
          note: "принят",
        };
      } else {
        newData[targetColumn].rows.push({
          ...sourceRow,
          status: sourceRow.status,
          note: "принят",
        });
      }
    } else if (action === "acceptWagon") {
      const targetRowIndex = newData[targetColumn].rows.findIndex(
        (row: RowData) => row.wagonNumber === sourceRow.wagonNumber
      );

      if (targetRowIndex >= 0) {
        newData[targetColumn].rows[targetRowIndex] = {
          ...sourceRow,
          status: "выгрузка +3",
          note: "принят",
        };
      } else {
        newData[targetColumn].rows.push({
          ...sourceRow,
          status: "выгрузка +3",
          note: "принят",
        });
      }
    }

    setData(newData);
  };

  const handleAcceptAllPlan = (columnId: ColumnId) => {
    const newData = JSON.parse(JSON.stringify(data)) as LogisticsData;

    const sourceColumn = columnId;
    const targetColumn = "projectPlan" as ColumnId;

    newData[targetColumn].rows = newData[sourceColumn].rows.map(
      (row: RowData) => ({
        ...row,
        status: row.status.includes("обеспечен") ? "выгрузка +3" : row.status,
        note: "принят",
      })
    );

    setData(newData);
  };

  const handleCompare = (source: ColumnId, target: ColumnId) => {
    setComparisonSource(source);
    setComparisonTarget(target);
    setShowComparison(true);
  };

  const handleViewDetails = (item: RowData) => {
    setDetailedItem(item);
  };

  const handleExpandColumn = (columnId: ColumnId) => {
    setExpandedColumn(columnId === expandedColumn ? null : columnId);
  };

  const columns: ColumnItem[] = [
    { id: "demand", title: "Спрос", data: data.demand, color: "bg-blue-500" },
    {
      id: "optimizerPlan",
      title: "План оптимизатора",
      data: data.optimizerPlan,
      color: "bg-[#b1053d]",
    },
    {
      id: "projectPlan",
      title: "Проект плана",
      data: data.projectPlan,
      color: "bg-purple-600",
    },
    {
      id: "approvedPlan",
      title: "Согласованный план",
      data: data.approvedPlan,
      color: "bg-green-600",
    },
    {
      id: "execution",
      title: "Факт исполнения",
      data: data.execution,
      color: "bg-amber-600",
    },
  ];

  return (
    <div className="flex h-screen flex-col">
      <AppHeader />

      <div className="flex-1 overflow-hidden p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Управление логистикой
            </h1>
            <p className="text-gray-500">
              Планирование и контроль перевозок • 18.09.2024
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleCompare("optimizerPlan", "projectPlan")}
            >
              <ArrowLeftRight size={16} />
              <span className="hidden sm:inline">Сравнить планы</span>
            </Button>
          </div>
        </div>

        <div className="h-[calc(100%-3rem)] overflow-hidden rounded-lg border bg-white shadow">
          <Tabs
            value={activeView}
            onValueChange={setActiveView}
            className="h-full"
          >
            <div className="border-b px-4">
              <TabsList>
                <TabsTrigger
                  value="columns"
                  className="flex items-center gap-1"
                >
                  <FileSpreadsheet size={16} />
                  <span className="hidden sm:inline">Колонки</span>
                </TabsTrigger>
                <TabsTrigger value="charts" className="flex items-center gap-1">
                  <BarChart3 size={16} />
                  <span className="hidden sm:inline">Графики</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-1">
                  <Map size={16} />
                  <span className="hidden sm:inline">Карта</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="columns"
              className="h-[calc(100%-48px)] data-[state=active]:block"
            >
              {expandedColumn ? (
                <ExpandedColumnView
                  column={columns.find((c) => c.id === expandedColumn)!}
                  onClose={() => setExpandedColumn(null)}
                  onAcceptItem={handleAcceptItem}
                  onAcceptAllPlan={handleAcceptAllPlan}
                  onViewDetails={handleViewDetails}
                />
              ) : (
                <div className="flex h-full overflow-hidden">
                  {columns.map((column) => (
                    <ColumnView
                      key={column.id}
                      column={column}
                      onAcceptItem={handleAcceptItem}
                      onAcceptAllPlan={handleAcceptAllPlan}
                      onViewDetails={handleViewDetails}
                      onExpand={handleExpandColumn}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="charts" className="h-[calc(100%-48px)]">
              <ChartView data={data} />
            </TabsContent>

            <TabsContent value="map" className="h-[calc(100%-48px)]">
              <MapView data={data} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showComparison && comparisonSource && comparisonTarget && (
        <ComparisonModal
          sourceData={data[comparisonSource]}
          targetData={data[comparisonTarget]}
          sourceTitle={
            columns.find((c) => c.id === comparisonSource)?.title || ""
          }
          targetTitle={
            columns.find((c) => c.id === comparisonTarget)?.title || ""
          }
          sourceColor={
            columns.find((c) => c.id === comparisonSource)?.color || ""
          }
          targetColor={
            columns.find((c) => c.id === comparisonTarget)?.color || ""
          }
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
        />
      )}

      {detailedItem && (
        <DetailedView
          item={detailedItem}
          isOpen={!!detailedItem}
          onClose={() => setDetailedItem(null)}
        />
      )}
    </div>
  );
}
