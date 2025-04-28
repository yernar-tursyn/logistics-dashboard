"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColumnId, ColumnItem, LogisticsData, RowData } from "@/types";

interface UnifiedTableViewProps {
  data: LogisticsData;
  columns: ColumnItem[];
  onAcceptItem: (columnId: ColumnId, rowId: string, action: string) => void;
  onAcceptAllPlan: (columnId: ColumnId) => void;
  onViewDetails: (item: RowData) => void;
}

export default function UnifiedTableView({
  data,
  columns,
  onAcceptItem,
  onAcceptAllPlan,
  onViewDetails,
}: UnifiedTableViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const allRowIds = useMemo(() => {
    const uniqueRowIds = new Set<string>();

    Object.values(data).forEach((columnData) => {
      columnData.rows.forEach((row) => {
        uniqueRowIds.add(row.id);
      });
    });

    return Array.from(uniqueRowIds);
  }, [data]);

  const rowDataMap = useMemo(() => {
    const map = new Map<string, Record<ColumnId, RowData | null>>();

    allRowIds.forEach((rowId) => {
      const rowData: Record<ColumnId, RowData | null> = {
        demand: null,
        optimizerPlan: null,
        projectPlan: null,
        approvedPlan: null,
        execution: null,
      };

      Object.entries(data).forEach(([columnId, columnData]) => {
        const row = columnData.rows.find((r) => r.id === rowId);
        if (row) {
          rowData[columnId as ColumnId] = row;
        }
      });

      map.set(rowId, rowData);
    });

    return map;
  }, [allRowIds, data]);

  const filteredRows = useMemo(() => {
    if (!searchTerm) return allRowIds;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return allRowIds.filter((rowId) => {
      const rowData = rowDataMap.get(rowId);
      if (!rowData) return false;

      return Object.values(rowData).some((columnRowData) => {
        if (!columnRowData) return false;

        return Object.entries(columnRowData).some(([, value]) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(lowerSearchTerm);
          }
          return false;
        });
      });
    });
  }, [allRowIds, rowDataMap, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "обеспечен":
      case "обеспечен 3 из 10":
        return "bg-green-100 text-green-800 border-green-200";
      case "обеспечен с корректировкой":
      case "обеспечен, с корректировкой по ограничениям":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "не обеспечен, по ограничениям":
        return "bg-red-100 text-red-800 border-red-200";
      case "не распределен":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ПОЗЖЕ":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "РАВНО":
        return "bg-green-100 text-green-800 border-green-200";
      case "РАНЬШЕ":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "выгрузка +3":
      case "выгрузка +3, плановая":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleAcceptClick = (
    e: React.MouseEvent,
    columnId: ColumnId,
    rowId: string,
    action: string
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const rowIndex = data[columnId].rows.findIndex((row) => row.id === rowId);
    if (rowIndex === -1) return;

    onAcceptItem(columnId, rowId, action);
  };

  const getWagonNumber = (rowId: string) => {
    const rowData = rowDataMap.get(rowId);
    if (!rowData) return "-";

    for (const columnId of Object.keys(rowData) as ColumnId[]) {
      const columnRowData = rowData[columnId];
      if (columnRowData?.wagonNumber) {
        return columnRowData.wagonNumber;
      }
    }

    return "-";
  };

  const FIRST_COLUMN_WIDTH = 200;
  const SECOND_COLUMN_WIDTH = 150;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Поиск..."
              className="pl-8 focus-visible:ring-[#b1053d]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Фильтр</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Экспорт в Excel</DropdownMenuItem>
                <DropdownMenuItem>Печать</DropdownMenuItem>
                <DropdownMenuItem>Настройки таблицы</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            className="bg-[#b1053d] text-white hover:bg-[#c52552]"
            onClick={() => onAcceptAllPlan("optimizerPlan")}
          >
            Принять весь план оптимизатора
          </Button>
        </div>
      </div>

      <div
        className="flex-1 overflow-auto"
        style={{ height: "calc(100% - 80px)" }}
      >
        <div style={{ paddingBottom: "20px" }}>
          <table
            className="w-full border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                <th
                  className="border border-gray-200 p-2 text-left font-medium text-gray-700 bg-gray-50 z-30"
                  style={{
                    position: "sticky",
                    left: 0,
                    width: `${FIRST_COLUMN_WIDTH}px`,
                    zIndex: 30,
                    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
                  }}
                >
                  Заявка/вагон
                </th>
                <th
                  className="border border-gray-200 p-2 text-left font-medium text-gray-700 bg-gray-50 z-30"
                  style={{
                    position: "sticky",
                    left: `${FIRST_COLUMN_WIDTH}px`,
                    width: `${SECOND_COLUMN_WIDTH}px`,
                    zIndex: 30,
                    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
                  }}
                >
                  № вагона
                </th>

                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={cn(
                      "border border-gray-200 p-2 text-left font-medium text-white",
                      column.color
                    )}
                    style={{ minWidth: "250px" }}
                  >
                    Заявка/вагон
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((rowId, rowIndex) => {
                const rowData = rowDataMap.get(rowId);
                if (!rowData) return null;

                const wagonNumber = getWagonNumber(rowId);
                const rowBgClass =
                  rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50";

                return (
                  <tr key={rowId} className="hover:bg-blue-50/20">
                    <td
                      className={cn(
                        "border border-gray-200 p-2 font-medium z-20",
                        rowBgClass
                      )}
                      style={{
                        position: "sticky",
                        left: 0,
                        width: `${FIRST_COLUMN_WIDTH}px`,
                        zIndex: 20,
                        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
                      }}
                      onClick={() => {
                        const firstNonNullData = Object.values(rowData).find(
                          (data) => data !== null
                        );
                        if (firstNonNullData) onViewDetails(firstNonNullData);
                      }}
                    >
                      {rowId}
                    </td>
                    <td
                      className={cn(
                        "border border-gray-200 p-2 z-20",
                        rowBgClass
                      )}
                      style={{
                        position: "sticky",
                        left: `${FIRST_COLUMN_WIDTH}px`,
                        width: `${SECOND_COLUMN_WIDTH}px`,
                        zIndex: 20,
                        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
                      }}
                      onClick={() => {
                        const firstNonNullData = Object.values(rowData).find(
                          (data) => data !== null
                        );
                        if (firstNonNullData) onViewDetails(firstNonNullData);
                      }}
                    >
                      {wagonNumber}
                    </td>

                    {columns.map((column) => {
                      const columnRowData = rowData[column.id];
                      const cellBgClass =
                        column.id === "demand"
                          ? "bg-blue-50"
                          : column.id === "optimizerPlan"
                          ? "bg-[#b1053d]/5"
                          : column.id === "projectPlan"
                          ? "bg-purple-50"
                          : column.id === "approvedPlan"
                          ? "bg-green-50"
                          : column.id === "execution"
                          ? "bg-amber-50"
                          : rowBgClass;

                      return (
                        <td
                          key={column.id}
                          className={cn(
                            "border border-gray-200 p-2",
                            cellBgClass
                          )}
                          style={{ minWidth: "250px", minHeight: "100px" }}
                          onClick={() =>
                            columnRowData && onViewDetails(columnRowData)
                          }
                        >
                          {columnRowData ? (
                            <div className="flex flex-col">
                              <div className="font-medium">{rowId}</div>
                              {columnRowData.wagonNumber && (
                                <div className="text-xs text-gray-500 mt-1">
                                  № вагона: {columnRowData.wagonNumber}
                                </div>
                              )}
                              <Badge
                                className={cn(
                                  "mt-2 w-fit font-normal",
                                  getStatusColor(columnRowData.status)
                                )}
                              >
                                {columnRowData.status}
                              </Badge>
                              {columnRowData.note && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {columnRowData.note}
                                </div>
                              )}

                              {column.id === "optimizerPlan" && (
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs text-[#b1053d] hover:bg-[#b1053d]/10 hover:text-[#b1053d]"
                                    onClick={(e) =>
                                      handleAcceptClick(
                                        e,
                                        column.id,
                                        rowId,
                                        "acceptRequest"
                                      )
                                    }
                                  >
                                    Принять заявку
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs text-[#b1053d] hover:bg-[#b1053d]/10 hover:text-[#b1053d]"
                                    onClick={(e) =>
                                      handleAcceptClick(
                                        e,
                                        column.id,
                                        rowId,
                                        "acceptWagon"
                                      )
                                    }
                                  >
                                    Принять вагон
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-400 italic">
                              Нет данных
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
