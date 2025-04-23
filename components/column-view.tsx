"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  MoreHorizontal,
  Plus,
  Maximize2,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColumnViewProps, RowData } from "@/types";

export default function ColumnView({
  column,
  onAcceptItem,
  onAcceptAllPlan,
  onViewDetails,
  onExpand,
}: ColumnViewProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    main: true,
    other: false,
  });

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

  return (
    <div className="flex-1 border-r last:border-r-0">
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
                  <Maximize2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Развернуть</TooltipContent>
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

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="p-2">
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
                {column.data.rows.map((row: RowData, index: number) => (
                  <div
                    key={index}
                    className="group cursor-pointer p-2 hover:bg-gray-50"
                    onClick={() => onViewDetails(row)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{row.id || "любой"}</div>
                      {row.wagonNumber && (
                        <div className="text-xs text-gray-500">
                          № вагона: {row.wagonNumber}
                        </div>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        className={cn(
                          "font-normal",
                          getStatusColor(row.status)
                        )}
                      >
                        {row.status}
                      </Badge>
                      {row.note && (
                        <span className="text-xs text-gray-500">
                          {row.note}
                        </span>
                      )}
                    </div>

                    {column.id === "optimizerPlan" && (
                      <div className="mt-2 hidden gap-1 group-hover:flex">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 flex-1 text-xs text-[#b1053d] hover:bg-[#b1053d]/10 hover:text-[#b1053d]"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAcceptItem(column.id, row.id, "acceptRequest");
                          }}
                        >
                          Принять заявку
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 flex-1 text-xs text-[#b1053d] hover:bg-[#b1053d]/10 hover:text-[#b1053d]"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAcceptItem(column.id, row.id, "acceptWagon");
                          }}
                        >
                          Принять вагон
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
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
      </ScrollArea>
    </div>
  );
}
