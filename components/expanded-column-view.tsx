"use client";

import type React from "react";

import { useState, useId } from "react";
import {
  Filter,
  MoreHorizontal,
  Minimize2,
  ArrowLeft,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import type { ExpandedColumnViewProps, RowData } from "@/types";

export default function ExpandedColumnView({
  column,
  onClose,
  onAcceptItem,
  onAcceptAllPlan,
  onViewDetails,
}: ExpandedColumnViewProps) {
  const [activeTab, setActiveTab] = useState("list");

  const componentId = useId();

  const getRowKey = (row: RowData, index: number) => {
    return `${componentId}_${column.id}_${row.id}_${index}`;
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

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center justify-between p-3 text-white",
          column.color
        )}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <ArrowLeft size={18} />
          </Button>
          <h2 className="text-lg font-medium">{column.title}</h2>
        </div>
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={onClose}
                >
                  <Minimize2 size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Свернуть</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <Filter size={18} />
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
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <MoreHorizontal size={18} />
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

      <div className="flex items-center justify-between border-b bg-gray-50 p-3">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Поиск..."
            className="pl-8 focus-visible:ring-[#b1053d]"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Список</TabsTrigger>
            <TabsTrigger value="cards">Карточки</TabsTrigger>
            <TabsTrigger value="details">Детали</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden">
        <TabsContent
          value="list"
          className="h-full overflow-hidden data-[state=active]:block"
        >
          <div className="h-full overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>№ вагона</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Примечание</TableHead>
                  {column.id === "optimizerPlan" && (
                    <TableHead>Действия</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {column.data.rows.map((row: RowData, index: number) => {
                  const rowKey = getRowKey(row, index);

                  return (
                    <TableRow
                      key={rowKey}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => onViewDetails(row)}
                      data-row-index={index}
                      data-row-key={rowKey}
                    >
                      <TableCell className="font-medium">{row.id}</TableCell>
                      <TableCell>{row.wagonNumber || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "font-normal",
                            getStatusColor(row.status)
                          )}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.note || "-"}</TableCell>
                      {column.id === "optimizerPlan" && (
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-xs text-[#b1053d] hover:bg-[#b1053d]/10 hover:text-[#b1053d]"
                              onClick={(e) =>
                                handleAcceptClick(
                                  e,
                                  row,
                                  index,
                                  "acceptRequest"
                                )
                              }
                              data-row-index={index}
                              data-row-key={rowKey}
                            >
                              Принять заявку
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-xs text-[#b1053d] hover:bg-[#b1053d]/10 hover:text-[#b1053d]"
                              onClick={(e) =>
                                handleAcceptClick(e, row, index, "acceptWagon")
                              }
                              data-row-index={index}
                              data-row-key={rowKey}
                            >
                              Принять вагон
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent
          value="cards"
          className="h-full overflow-hidden data-[state=active]:block"
        >
          <div className="h-full overflow-auto">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
                {column.data.rows.map((row: RowData, index: number) => {
                  const rowKey = getRowKey(row, index);

                  return (
                    <div
                      key={rowKey}
                      className="group cursor-pointer rounded-lg border p-3 transition-all hover:border-[#b1053d] hover:shadow-md"
                      onClick={() => onViewDetails(row)}
                      data-row-index={index}
                      data-row-key={rowKey}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{row.id}</div>
                      </div>
                      <div className="mt-2">
                        <Badge
                          className={cn(
                            "font-normal",
                            getStatusColor(row.status)
                          )}
                        >
                          {row.status}
                        </Badge>
                      </div>
                      {row.wagonNumber && (
                        <div className="mt-2 text-sm text-gray-500">
                          № вагона: {row.wagonNumber}
                        </div>
                      )}
                      {row.note && (
                        <div className="mt-1 text-xs text-gray-500">
                          {row.note}
                        </div>
                      )}

                      {column.id === "optimizerPlan" && (
                        <div className="mt-3 hidden gap-2 group-hover:flex">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 flex-1 text-xs text-[#b1053d] hover:bg-[#b1053d]/10 hover:text-[#b1053d]"
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
                            className="h-6 flex-1 text-xs text-[#b1053d] hover:bg-[#b1053d]/10 hover:text-[#b1053d]"
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
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent
          value="details"
          className="h-full overflow-hidden data-[state=active]:block"
        >
          <div className="h-full overflow-auto">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">Статистика</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Всего заявок:</span>
                        <span className="font-medium">
                          {column.data.rows.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Обеспечено:</span>
                        <span className="font-medium">
                          {
                            column.data.rows.filter((r: RowData) =>
                              r.status.includes("обеспечен")
                            ).length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Не обеспечено:</span>
                        <span className="font-medium">
                          {
                            column.data.rows.filter((r: RowData) =>
                              r.status.includes("не обеспечен")
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-medium">
                      Дополнительная информация
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Дата создания:</span>
                        <span className="font-medium">18.09.2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Последнее обновление:</span>
                        <span className="font-medium">19.09.2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Статус:</span>
                        <span className="font-medium">Активный</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border">
                  <div className="border-b bg-gray-50 p-3 font-medium">
                    Детальная информация
                  </div>
                  <div className="p-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>№ вагона</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Примечание</TableHead>
                          <TableHead>Дополнительно</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {column.data.rows.map((row: RowData, index: number) => {
                          const rowKey = getRowKey(row, index);

                          return (
                            <TableRow key={rowKey}>
                              <TableCell className="font-medium">
                                {row.id}
                              </TableCell>
                              <TableCell>{row.wagonNumber || "-"}</TableCell>
                              <TableCell>
                                <Badge
                                  className={cn(
                                    "font-normal",
                                    getStatusColor(row.status)
                                  )}
                                >
                                  {row.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{row.note || "-"}</TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onViewDetails(row)}
                                  data-row-index={index}
                                  data-row-key={rowKey}
                                >
                                  Подробнее
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
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
}
