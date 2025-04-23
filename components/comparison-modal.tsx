"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceData: any;
  targetData: any;
  sourceTitle: string;
  targetTitle: string;
  sourceColor: string;
  targetColor: string;
}

export default function ComparisonModal({
  isOpen,
  onClose,
  sourceData,
  targetData,
  sourceTitle,
  targetTitle,
  sourceColor,
  targetColor,
}: ComparisonModalProps) {
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

  const compareRows = () => {
    const allRows: any[] = [];
    const sourceRowMap = new Map();
    const targetRowMap = new Map();

    sourceData.rows.forEach((row: any) => {
      const key = row.wagonNumber || row.id;
      sourceRowMap.set(key, row);
    });

    targetData.rows.forEach((row: any) => {
      const key = row.wagonNumber || row.id;
      targetRowMap.set(key, row);
    });

    const allKeys = new Set([...sourceRowMap.keys(), ...targetRowMap.keys()]);

    allKeys.forEach((key) => {
      const sourceRow = sourceRowMap.get(key);
      const targetRow = targetRowMap.get(key);

      allRows.push({
        key,
        source: sourceRow,
        target: targetRow,
        different:
          !sourceRow || !targetRow || sourceRow.status !== targetRow.status,
      });
    });

    return allRows;
  };

  const comparedRows = compareRows();
  const differentCount = comparedRows.filter((r) => r.different).length;
  const matchCount = comparedRows.filter((r) => !r.different).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Сравнение планов</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-grow">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className={cn("rounded-lg p-3 text-white", sourceColor)}>
              <h3 className="font-medium">{sourceTitle}</h3>
            </div>
            <div className={cn("rounded-lg p-3 text-white", targetColor)}>
              <h3 className="font-medium">{targetTitle}</h3>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-100 p-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <span className="text-sm font-medium">
                  Различия: {differentCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
                <span className="text-sm font-medium">
                  Совпадения: {matchCount}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Принять все изменения
              </Button>
              <Button size="sm" variant="outline">
                Отклонить все изменения
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {comparedRows.map((row, index) => (
              <div
                key={row.key}
                className={cn(
                  "rounded-lg border p-3",
                  row.different
                    ? "border-yellow-300 bg-yellow-50"
                    : "border-gray-200"
                )}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    {row.source ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {row.source.id || "любой"}
                          </span>
                          <span className="text-sm text-gray-500">
                            № вагона: {row.source.wagonNumber || "-"}
                          </span>
                        </div>
                        <Badge
                          className={cn(
                            "mt-2 w-fit font-normal",
                            getStatusColor(row.source.status)
                          )}
                        >
                          {row.source.status}
                        </Badge>
                        {row.source.note && (
                          <div className="mt-1 text-xs text-gray-500">
                            {row.source.note}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center italic text-gray-400">
                        Отсутствует в {sourceTitle}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    {row.target ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {row.target.id || "любой"}
                          </span>
                          <span className="text-sm text-gray-500">
                            № вагона: {row.target.wagonNumber || "-"}
                          </span>
                        </div>
                        <Badge
                          className={cn(
                            "mt-2 w-fit font-normal",
                            getStatusColor(row.target.status)
                          )}
                        >
                          {row.target.status}
                        </Badge>
                        {row.target.note && (
                          <div className="mt-1 text-xs text-gray-500">
                            {row.target.note}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center italic text-gray-400">
                        Отсутствует в {targetTitle}
                      </div>
                    )}
                  </div>
                </div>

                {row.different && (
                  <div className="mt-3 flex justify-end gap-2 border-t pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <X size={14} />
                      Отклонить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Check size={14} />
                      Принять
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
