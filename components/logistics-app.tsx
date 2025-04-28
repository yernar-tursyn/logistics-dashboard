"use client";

import type React from "react";

import { useState, useRef } from "react";
import { mockData } from "@/lib/mock-data";
import AppHeader from "@/components/app-header";
import ColumnView from "@/components/column-view";
import ComparisonModal from "@/components/comparison-modal";
import DetailedView from "@/components/detailed-view";
import ChartView from "@/components/chart-view";
import MapView from "@/components/map-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  FileSpreadsheet,
  BarChart3,
  Map,
  Maximize2,
  Minimize2,
} from "lucide-react";
import type { ColumnId, ColumnItem, LogisticsData, RowData } from "@/types";

export default function LogisticsApp() {
  const [data, setData] = useState<LogisticsData>(mockData);
  const [activeView, setActiveView] = useState("columns");
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonSource, setComparisonSource] = useState<ColumnId | "">("");
  const [comparisonTarget, setComparisonTarget] = useState<ColumnId | "">("");
  const [detailedItem, setDetailedItem] = useState<RowData | null>(null);

  const [expandedColumns, setExpandedColumns] = useState<
    Record<ColumnId, boolean>
  >({
    demand: false,
    optimizerPlan: false,
    projectPlan: false,
    approvedPlan: false,
    execution: false,
  });

  const columnsContainerRef = useRef<HTMLDivElement>(null);

  const columnContentRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [isScrolling, setIsScrolling] = useState(false);

  const registerColumnContentRef = (id: string, ref: HTMLDivElement | null) => {
    columnContentRefs.current[id] = ref;
  };

  const syncScroll = (scrollTop: number) => {
    if (isScrolling) return;

    setIsScrolling(true);

    Object.values(columnContentRefs.current).forEach((ref) => {
      if (ref) {
        ref.scrollTop = scrollTop;
      }
    });

    setTimeout(() => {
      setIsScrolling(false);
    }, 50);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    syncScroll(scrollTop);
  };

  const handleAcceptItem = (
    columnId: ColumnId,
    rowIndexStr: string,
    action: string
  ) => {
    const newData = JSON.parse(JSON.stringify(data)) as LogisticsData;

    const rowIndex = Number.parseInt(rowIndexStr, 10);

    if (
      isNaN(rowIndex) ||
      rowIndex < 0 ||
      rowIndex >= newData[columnId].rows.length
    ) {
      console.error("Invalid row index:", rowIndex, "for column", columnId);
      return;
    }

    const sourceRow = newData[columnId].rows[rowIndex];
    console.log(`Found source row at index ${rowIndex}:`, sourceRow);

    const newRow = {
      ...sourceRow,
      status: action === "acceptRequest" ? sourceRow.status : "выгрузка +3",
      note: "принят",
    };

    const targetColumn = "projectPlan" as ColumnId;

    const existingRowIndex = newData[targetColumn].rows.findIndex(
      (row: RowData) =>
        row.id === sourceRow.id && row.wagonNumber === sourceRow.wagonNumber
    );

    if (existingRowIndex >= 0) {
      console.log(
        `Updating existing row at index ${existingRowIndex} in ${targetColumn}`
      );
      newData[targetColumn].rows[existingRowIndex] = newRow;
    } else {
      console.log(`Inserting new row at index ${rowIndex} in ${targetColumn}`);

      const targetRows = [...newData[targetColumn].rows];

      if (rowIndex < targetRows.length) {
        targetRows.splice(rowIndex, 0, newRow);
      } else {
        targetRows.push(newRow);
      }

      newData[targetColumn].rows = targetRows;
    }

    setData(newData);
  };

  const handleAcceptAllPlan = (columnId: ColumnId) => {
    const newData = JSON.parse(JSON.stringify(data)) as LogisticsData;

    const sourceColumn = columnId;
    const targetColumn = "projectPlan" as ColumnId;

    const newRows = newData[sourceColumn].rows.map((row: RowData) => ({
      ...row,
      status: row.status.includes("обеспечен") ? "выгрузка +3" : row.status,
      note: "принят",
    }));

    newData[targetColumn].rows = newRows;

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
    setExpandedColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const handleExpandAllColumns = (expand: boolean) => {
    const newState: Record<ColumnId, boolean> = {
      demand: expand,
      optimizerPlan: expand,
      projectPlan: expand,
      approvedPlan: expand,
      execution: expand,
    };
    setExpandedColumns(newState);
  };

  const areAllColumnsExpanded = Object.values(expandedColumns).every(
    (expanded) => expanded
  );

  const hasExpandedColumns = Object.values(expandedColumns).some(
    (expanded) => expanded
  );

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

            {activeView === "columns" && (
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleExpandAllColumns(!areAllColumnsExpanded)}
              >
                {areAllColumnsExpanded ? (
                  <>
                    <Minimize2 size={16} />
                    <span className="hidden sm:inline">Свернуть все</span>
                  </>
                ) : (
                  <>
                    <Maximize2 size={16} />
                    <span className="hidden sm:inline">Развернуть все</span>
                  </>
                )}
              </Button>
            )}
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
              <div
                className="flex h-full overflow-y-auto overflow-x-auto p-0 m-0"
                ref={columnsContainerRef}
                onScroll={handleScroll}
                style={{ scrollbarGutter: "stable" }}
              >
                {columns.map((column) => {
                  const isExpanded = expandedColumns[column.id];

                  const columnWidth = isExpanded
                    ? "3500px"
                    : hasExpandedColumns
                    ? "200px"
                    : `${100 / columns.length}%`;

                  return (
                    <div
                      key={column.id}
                      className="transition-all duration-300 h-full"
                      style={{
                        width: columnWidth,
                        minWidth: isExpanded ? "3500px" : "200px",
                        flex: isExpanded
                          ? "0 0 auto"
                          : hasExpandedColumns
                          ? "0 0 auto"
                          : "1",
                      }}
                    >
                      <ColumnView
                        column={column}
                        onAcceptItem={handleAcceptItem}
                        onAcceptAllPlan={handleAcceptAllPlan}
                        onViewDetails={handleViewDetails}
                        onExpand={handleExpandColumn}
                        isExpanded={isExpanded}
                        allColumnsData={data}
                        registerContentRef={registerColumnContentRef}
                      />
                    </div>
                  );
                })}
              </div>
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
