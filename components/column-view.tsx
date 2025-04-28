"use client";

import type React from "react";

import { useState, useId, useMemo, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  MoreHorizontal,
  Plus,
  Maximize2,
  Minimize2,
  Search,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColumnViewProps, RowData, LogisticsData } from "@/types";
import { getDetailedData } from "@/lib/detailed-data";
import { Input } from "@/components/ui/input";

type DetailedRowData = {
  id: string;
  status: string;
  note: string;
  wagonNumber: string;
  carType: string;
  client: string;
  manager: string;
  shipper: string;
  cargo: string;
  weight: number;
  requestedCars: number;
  mandatory: boolean;
  departureStation: string;
  destinationStation: string;
  returnStation: string;
  calculatedTurnover: number;
  approach: number;
  loading: number;
  loadedRun: number;
  unloading: number;
  return: number;
  carDays: number;
  clientRate: string;
  emptyTariff: string;
  loadedTariff: string;
  provisionIncome: string;
  dailyProfitability: string;
  totalAmount: string;
  deadEndPerDay: string;
  supply: string;
  day1: number;
  day2: number;
  day3: number;
};

export default function ColumnView({
  column,
  onAcceptItem,
  onAcceptAllPlan,
  onViewDetails,
  onExpand,
  isExpanded,
  registerContentRef,
  allColumnsData,
}: ColumnViewProps & {
  isExpanded?: boolean;
  registerContentRef?: (id: string, ref: HTMLDivElement | null) => void;
  allColumnsData?: LogisticsData;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    main: true,
    other: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending" | null;
  }>({ key: "", direction: null });

  const detailedData = getDetailedData(column.id);

  const componentId = useId();

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (registerContentRef) {
      registerContentRef(column.id, contentRef.current);
      return () => {
        registerContentRef(column.id, null);
      };
    }
  }, [column.id, registerContentRef]);

  const getRowKey = (row: RowData, index: number) => {
    return `${componentId}_${column.id}_${row.id}_${index}`;
  };

  const handleRowHover = (rowId: string, isHovering: boolean) => {
    const rows = document.querySelectorAll(`[data-row-id="${rowId}"]`);

    rows.forEach((row) => {
      if (isHovering) {
        row.classList.add("bg-blue-50");
      } else {
        row.classList.remove("bg-blue-50");
      }
    });
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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

  const renderActionButtons = () => {
    if (column.id === "optimizerPlan") {
      return (
        <Button
          size="sm"
          className="mt-2 w-full bg-[#b1053d] text-white hover:bg-[#c52552]"
          onClick={() => onAcceptAllPlan(column.id)}
        >
          Принять весь план
        </Button>
      );
    }
    return null;
  };

  const handleAcceptClick = (
    e: React.MouseEvent,
    row: RowData,
    index: number,
    action: string
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const rowKey = getRowKey(row, index);

    console.log(`Accepting ${action} for row:`, row);
    console.log(`Row index: ${index}, Row key: ${rowKey}`);

    onAcceptItem(column.id, index.toString(), action);
  };

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" | null = "ascending";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  const allRowIds = useMemo(() => {
    if (!allColumnsData) return column.data.rows.map((row) => row.id);

    const uniqueRowIds = new Set<string>();

    Object.values(allColumnsData).forEach((columnData) => {
      columnData.rows.forEach((row) => {
        uniqueRowIds.add(row.id);
      });
    });

    return Array.from(uniqueRowIds);
  }, [allColumnsData, column.data.rows]);

  const rowDataMap = useMemo(() => {
    const map = new Map<string, RowData>();
    column.data.rows.forEach((row) => {
      map.set(row.id, row);
    });
    return map;
  }, [column.data.rows]);

  const unifiedRows = useMemo(() => {
    return allRowIds.map((id) => {
      return (
        rowDataMap.get(id) || { id, status: "", note: "", wagonNumber: "" }
      );
    });
  }, [allRowIds, rowDataMap]);

  const filteredCompactData = useMemo(() => {
    if (!searchTerm) return unifiedRows;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return unifiedRows.filter((row) => {
      return Object.values(row).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(lowerSearchTerm);
        }
        return false;
      });
    });
  }, [unifiedRows, searchTerm]);

  const renderCompactView = () => (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Поиск..."
            className="pl-8 focus-visible:ring-[#b1053d]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1" ref={contentRef}>
        <div className="p-1.5">
          <Collapsible
            open={openSections.main}
            onOpenChange={() => toggleSection("main")}
            className="mb-2 rounded border"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between bg-gray-100 p-2 hover:bg-gray-200">
              <div className="flex items-center">
                <span className="font-medium">Заявка/вагон</span>
              </div>
              {openSections.main ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="divide-y">
                {filteredCompactData.map((row: RowData, index: number) => {
                  const rowKey = getRowKey(row, index);

                  if (!row.id) return null;

                  return (
                    <div
                      key={rowKey}
                      className="group cursor-pointer p-1.5 hover:bg-gray-50 h-[100px] flex flex-col justify-between relative"
                      onClick={() => {
                        if (row.status) {
                          onViewDetails(row);
                        }
                      }}
                      data-row-index={index}
                      data-row-key={rowKey}
                      data-row-id={row.id}
                      onMouseEnter={() => handleRowHover(row.id, true)}
                      onMouseLeave={() => handleRowHover(row.id, false)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium truncate">{row.id}</div>
                        {row.wagonNumber && (
                          <div className="text-xs text-gray-500 ml-1 whitespace-nowrap">
                            № вагона: {row.wagonNumber}
                          </div>
                        )}
                      </div>
                      {row.status && (
                        <div className="mt-2 flex items-center gap-2 overflow-hidden">
                          <Badge
                            className={cn(
                              "font-normal",
                              getStatusColor(row.status)
                            )}
                          >
                            {row.status}
                          </Badge>
                          {row.note && (
                            <span className="text-xs text-gray-500 truncate">
                              {row.note}
                            </span>
                          )}
                        </div>
                      )}

                      {column.id === "optimizerPlan" && row.status && (
                        <div className="absolute bottom-1.5 left-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 flex-1 text-xs text-[#b1053d] hover:bg-[#b1053d]/10 hover:text-[#b1053d]"
                            onClick={(e) =>
                              handleAcceptClick(e, row, index, "acceptRequest")
                            }
                            data-row-index={index}
                            data-row-key={rowKey}
                          >
                            Принять заявку
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 flex-1 text-xs text-[#b1053d] hover:bg-[#b1053d]/10 hover:text-[#b1053d]"
                            onClick={(e) =>
                              handleAcceptClick(e, row, index, "acceptWagon")
                            }
                            data-row-index={index}
                            data-row-key={rowKey}
                          >
                            Принять вагон
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={openSections.other}
            onOpenChange={() => toggleSection("other")}
            className="rounded border"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between bg-gray-100 p-2 hover:bg-gray-200">
              <div className="flex items-center">
                <span className="font-medium">Прочие</span>
              </div>
              {openSections.other ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Прочие</div>
                  {column.id === "optimizerPlan" && (
                    <div className="text-xs text-gray-500">
                      № вагона: 444444
                    </div>
                  )}
                </div>
                <div className="mt-1">
                  <Badge
                    className={cn(
                      "font-normal",
                      getStatusColor("не распределен")
                    )}
                  >
                    не распределен
                  </Badge>
                </div>
                {column.id === "projectPlan" && (
                  <div className="mt-1">
                    <Badge variant="outline" className="text-red-600">
                      Не включен в план
                    </Badge>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {renderActionButtons()}

          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full justify-start text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <Plus size={16} className="mr-1" />
            Добавить элемент
          </Button>
        </div>
      </div>
    </div>
  );

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return null;
    }

    if (sortConfig.direction === "ascending") {
      return <ArrowUp size={14} className="ml-1" />;
    }

    if (sortConfig.direction === "descending") {
      return <ArrowDown size={14} className="ml-1" />;
    }

    return null;
  };

  const unifiedDetailedData = useMemo(() => {
    const detailedDataMap = new Map<string, DetailedRowData>();
    detailedData.forEach((row) => {
      detailedDataMap.set(row.id, row);
    });

    return allRowIds.map((id) => {
      return (
        detailedDataMap.get(id) || {
          id,
          status: "",
          note: "",
          wagonNumber: "",
          carType: "",
          client: "",
          manager: "",
          shipper: "",
          cargo: "",
          weight: 0,
          requestedCars: 0,
          mandatory: false,
          departureStation: "",
          destinationStation: "",
          returnStation: "",
          calculatedTurnover: 0,
          approach: 0,
          loading: 0,
          loadedRun: 0,
          unloading: 0,
          return: 0,
          carDays: 0,
          clientRate: "",
          emptyTariff: "",
          loadedTariff: "",
          provisionIncome: "",
          dailyProfitability: "",
          totalAmount: "",
          deadEndPerDay: "",
          supply: "",
          day1: 0,
          day2: 0,
          day3: 0,
        }
      );
    });
  }, [allRowIds, detailedData]);

  const filteredAndSortedData = useMemo(() => {
    let filteredData = [...unifiedDetailedData];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter((row) => {
        if (!row.id) return false;

        return Object.values(row).some((value) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(lowerSearchTerm);
          }
          if (typeof value === "number") {
            return value.toString().includes(lowerSearchTerm);
          }
          return false;
        });
      });
    }

    if (sortConfig.key && sortConfig.direction) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof DetailedRowData];
        const bValue = b[sortConfig.key as keyof DetailedRowData];

        if (aValue === bValue) return 0;

        if (sortConfig.direction === "ascending") {
          if (typeof aValue === "string" && typeof bValue === "string") {
            return aValue.localeCompare(bValue);
          }
          return aValue < bValue ? -1 : 1;
        } else {
          if (typeof aValue === "string" && typeof bValue === "string") {
            return bValue.localeCompare(aValue);
          }
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filteredData;
  }, [unifiedDetailedData, searchTerm, sortConfig]);

  const renderDetailedView = () => (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Поиск по всем полям..."
            className="pl-8 focus-visible:ring-[#b1053d]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-x-auto" ref={contentRef}>
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-white">
            <tr>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[200px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("id")}
              >
                <div className="flex items-center">
                  Спрос {getSortIcon("id")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[120px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("carType")}
              >
                <div className="flex items-center">
                  Род ПС {getSortIcon("carType")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[150px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("client")}
              >
                <div className="flex items-center">
                  Клиент {getSortIcon("client")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[150px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("manager")}
              >
                <div className="flex items-center">
                  Менеджер {getSortIcon("manager")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[150px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("shipper")}
              >
                <div className="flex items-center">
                  Грузоотправитель {getSortIcon("shipper")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[150px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("cargo")}
              >
                <div className="flex items-center">
                  Груз, класс {getSortIcon("cargo")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[80px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("weight")}
              >
                <div className="flex items-center">
                  Вес, тн {getSortIcon("weight")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[80px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("requestedCars")}
              >
                <div className="flex items-center">
                  Заявлено вагонов {getSortIcon("requestedCars")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[100px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("mandatory")}
              >
                <div className="flex items-center">
                  Обязательно {getSortIcon("mandatory")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[150px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("departureStation")}
              >
                <div className="flex items-center">
                  Станция отправления {getSortIcon("departureStation")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[150px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("destinationStation")}
              >
                <div className="flex items-center">
                  Станция назначения {getSortIcon("destinationStation")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[150px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("returnStation")}
              >
                <div className="flex items-center">
                  Станция возврата {getSortIcon("returnStation")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[80px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("calculatedTurnover")}
              >
                <div className="flex items-center">
                  Расчетный оборот {getSortIcon("calculatedTurnover")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[80px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("approach")}
              >
                <div className="flex items-center">
                  подсыл {getSortIcon("approach")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[80px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("loading")}
              >
                <div className="flex items-center">
                  погрузка {getSortIcon("loading")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[80px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("loadedRun")}
              >
                <div className="flex items-center">
                  груженый ход {getSortIcon("loadedRun")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[80px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("unloading")}
              >
                <div className="flex items-center">
                  выгрузка {getSortIcon("unloading")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[80px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("return")}
              >
                <div className="flex items-center">
                  возврат {getSortIcon("return")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[80px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("carDays")}
              >
                <div className="flex items-center">
                  Вагоносутки {getSortIcon("carDays")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[120px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("clientRate")}
              >
                <div className="flex items-center">
                  Ставка клиенту {getSortIcon("clientRate")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[120px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("emptyTariff")}
              >
                <div className="flex items-center">
                  порожний тариф {getSortIcon("emptyTariff")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[120px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("loadedTariff")}
              >
                <div className="flex items-center">
                  груженый тариф {getSortIcon("loadedTariff")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[120px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("provisionIncome")}
              >
                <div className="flex items-center">
                  доход от предоставления {getSortIcon("provisionIncome")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[120px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("dailyProfitability")}
              >
                <div className="flex items-center">
                  Суточная доходность {getSortIcon("dailyProfitability")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[120px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("totalAmount")}
              >
                <div className="flex items-center">
                  Общая сумма {getSortIcon("totalAmount")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[120px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("deadEndPerDay")}
              >
                <div className="flex items-center">
                  Тупик, вагон/сут {getSortIcon("deadEndPerDay")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[80px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("supply")}
              >
                <div className="flex items-center">
                  Подача {getSortIcon("supply")}
                </div>
              </th>
              <th
                className="border border-gray-200 p-2 text-left font-medium text-gray-700 w-[150px] truncate cursor-pointer hover:bg-gray-50"
                onClick={() => requestSort("status")}
              >
                <div className="flex items-center">
                  Статус {getSortIcon("status")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((row, index) => {
              if (!row.id) return null;

              return (
                <tr
                  key={index}
                  className="cursor-pointer hover:bg-gray-50 h-[60px]"
                  onClick={() => {
                    if (row.status) {
                      const foundRow = column.data.rows.find(
                        (r) => r.id === row.id
                      );
                      if (foundRow) {
                        onViewDetails(foundRow);
                      } else {
                        const rowData: RowData = {
                          id: row.id,
                          status: row.status,
                          note: row.note || "",
                          wagonNumber: row.wagonNumber || "",
                        };
                        onViewDetails(rowData);
                      }
                    }
                  }}
                  data-row-id={row.id}
                  onMouseEnter={() => handleRowHover(row.id, true)}
                  onMouseLeave={() => handleRowHover(row.id, false)}
                >
                  <td className="border border-gray-200 p-2 font-medium overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]">
                    {row.id}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                    {row.carType}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                    {row.client}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                    {row.manager}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                    {row.shipper}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                    {row.cargo}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">
                    {row.weight}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">
                    {row.requestedCars}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px]">
                    {row.mandatory ? "Да" : "Нет"}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                    {row.departureStation}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                    {row.destinationStation}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]">
                    {row.returnStation}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">
                    {row.calculatedTurnover}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">
                    {row.approach}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">
                    {row.loading}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">
                    {row.loadedRun}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">
                    {row.unloading}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">
                    {row.return}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">
                    {row.carDays}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                    {row.clientRate}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                    {row.emptyTariff}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                    {row.loadedTariff}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                    {row.provisionIncome}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                    {row.dailyProfitability}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                    {row.totalAmount}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                    {row.deadEndPerDay}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">
                    {row.supply}
                  </td>
                  <td className="border border-gray-200 p-2 overflow-hidden whitespace-nowrap max-w-[150px]">
                    {row.status && (
                      <Badge
                        className={cn(
                          "font-normal",
                          getStatusColor(row.status)
                        )}
                      >
                        {row.status}
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {column.id === "optimizerPlan" && (
        <div className="border-t p-3">
          <Button
            className="w-full bg-[#b1053d] text-white hover:bg-[#c52552]"
            onClick={() => onAcceptAllPlan(column.id)}
          >
            Принять весь план
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-full flex-col border-r last:border-r-0">
      <div
        className={cn(
          "flex items-center justify-between p-2 text-white",
          column.color
        )}
      >
        <h2 className="font-medium">{column.title}</h2>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/20"
                  onClick={() => onExpand(column.id)}
                >
                  {isExpanded ? (
                    <Minimize2 size={16} />
                  ) : (
                    <Maximize2 size={16} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isExpanded ? "Свернуть" : "Развернуть"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white hover:bg-white/20"
                >
                  <Filter size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Фильтр</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20"
              >
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Экспорт</DropdownMenuItem>
              <DropdownMenuItem>Печать</DropdownMenuItem>
              <DropdownMenuItem>Настройки</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isExpanded ? renderDetailedView() : renderCompactView()}
    </div>
  );
}
