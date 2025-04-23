"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailedViewProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

export default function DetailedView({
  isOpen,
  onClose,
  item,
}: DetailedViewProps) {
  if (!item) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Детализация заявки</DialogTitle>
        </DialogHeader>

        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border bg-gray-50 p-3">
            <div className="text-sm text-gray-500">ID заявки</div>
            <div className="font-medium">{item.id}</div>
          </div>
          <div className="rounded-lg border bg-gray-50 p-3">
            <div className="text-sm text-gray-500">№ вагона</div>
            <div className="font-medium">
              {item.wagonNumber || "Не назначен"}
            </div>
          </div>
          <div className="rounded-lg border bg-gray-50 p-3">
            <div className="text-sm text-gray-500">Статус</div>
            <Badge
              className={cn("mt-1 font-normal", getStatusColor(item.status))}
            >
              {item.status}
            </Badge>
          </div>
          <div className="rounded-lg border bg-gray-50 p-3">
            <div className="text-sm text-gray-500">Дата</div>
            <div className="font-medium">18.09.2024</div>
          </div>
        </div>

        <Tabs defaultValue="main">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="main" className="flex items-center gap-1">
              <FileText size={16} />
              <span className="hidden sm:inline">Основные данные</span>
            </TabsTrigger>
            <TabsTrigger value="route" className="flex items-center gap-1">
              <MapPin size={16} />
              <span className="hidden sm:inline">Маршрут</span>
            </TabsTrigger>
            <TabsTrigger value="timing" className="flex items-center gap-1">
              <Clock size={16} />
              <span className="hidden sm:inline">Время</span>
            </TabsTrigger>
            <TabsTrigger value="cargo" className="flex items-center gap-1">
              <Truck size={16} />
              <span className="hidden sm:inline">Груз</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="rounded-lg border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium">Информация о заявке</h3>
                <div className="space-y-2 rounded-lg border bg-gray-50 p-3">
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Тип вагона</div>
                    <div className="text-sm">полувагон</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Клиент</div>
                    <div className="text-sm">Т-СЕРВИС Л.</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Получатель</div>
                    <div className="text-sm">Магдаля</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Информация о грузе</h3>
                <div className="space-y-2 rounded-lg border bg-gray-50 p-3">
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Груз</div>
                    <div className="text-sm">Уголь каменный мл</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Класс</div>
                    <div className="text-sm">
                      <Badge className="bg-red-100 text-red-800">АО Щуба</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Вес, тн</div>
                    <div className="text-sm">69</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="route" className="rounded-lg border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium">Пункт отправления</h3>
                <div className="space-y-2 rounded-lg border bg-gray-50 p-3">
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Станция</div>
                    <div className="text-sm">Шубарколь</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Дорога</div>
                    <div className="text-sm">Лужская</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Пункт назначения</h3>
                <div className="space-y-2 rounded-lg border bg-gray-50 p-3">
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Станция</div>
                    <div className="text-sm">Шубарколь</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Дорога</div>
                    <div className="text-sm">Лужская</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 h-40 rounded-lg border bg-gray-100 p-2 text-center">
              <div className="flex h-full items-center justify-center text-gray-400">
                Карта маршрута
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timing" className="rounded-lg border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium">Временные показатели</h3>
                <div className="space-y-2 rounded-lg border bg-gray-50 p-3">
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Расчетный</div>
                    <div className="text-sm">32</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Подсыл</div>
                    <div className="text-sm">0</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Погрузка</div>
                    <div className="text-sm">5</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Груженый ход</div>
                    <div className="text-sm">11</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Календарный план</h3>
                <div className="rounded-lg border bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm font-medium">Сентябрь 2024</div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Calendar size={14} />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    <div>Пн</div>
                    <div>Вт</div>
                    <div>Ср</div>
                    <div>Чт</div>
                    <div>Пт</div>
                    <div>Сб</div>
                    <div>Вс</div>
                  </div>
                  <div className="mt-1 grid grid-cols-7 gap-1">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex h-7 w-full items-center justify-center rounded text-xs",
                          i === 17
                            ? "bg-[#b1053d] text-white"
                            : "hover:bg-gray-200"
                        )}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cargo" className="rounded-lg border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-medium">Характеристики груза</h3>
                <div className="space-y-2 rounded-lg border bg-gray-50 p-3">
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Наименование</div>
                    <div className="text-sm">Уголь каменный мл</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Код ЕТСНГ</div>
                    <div className="text-sm">161005</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Класс опасности</div>
                    <div className="text-sm">Неопасный</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Вес брутто, тн</div>
                    <div className="text-sm">69</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Вес нетто, тн</div>
                    <div className="text-sm">67</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Требования к перевозке</h3>
                <div className="space-y-2 rounded-lg border bg-gray-50 p-3">
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Особые условия</div>
                    <div className="text-sm">Нет</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Тип вагона</div>
                    <div className="text-sm">Полувагон</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">
                      Количество вагонов
                    </div>
                    <div className="text-sm">1</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500">Приоритет</div>
                    <div className="text-sm">Обычный</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline">Печать</Button>
          <Button variant="outline">Экспорт</Button>
          <Button className="bg-[#b1053d] hover:bg-[#c52552]">
            Редактировать
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
