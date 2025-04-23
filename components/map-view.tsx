"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layers, MapPin, Truck, Train, Ship } from "lucide-react";

interface MapViewProps {
  data: any;
}

export default function MapView({ data }: MapViewProps) {
  const [mapType, setMapType] = useState("routes");
  const [selectedColumn, setSelectedColumn] = useState("all");
  const [showLegend, setShowLegend] = useState(true);

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
      case "all":
        return "Все колонки";
      default:
        return columnKey;
    }
  };

  const getRoutesData = () => {
    const routes = [
      {
        id: 1,
        from: "Шубарколь",
        to: "Лужская",
        status: "обеспечен",
        wagonCount: 3,
        distance: 1250,
      },
      {
        id: 2,
        from: "Магдаля",
        to: "Шубарколь",
        status: "не обеспечен, по ограничениям",
        wagonCount: 2,
        distance: 850,
      },
      {
        id: 3,
        from: "Лужская",
        to: "Магдаля",
        status: "обеспечен с корректировкой",
        wagonCount: 1,
        distance: 1100,
      },
      {
        id: 4,
        from: "Шубарколь",
        to: "Магдаля",
        status: "ПОЗЖЕ",
        wagonCount: 4,
        distance: 950,
      },
      {
        id: 5,
        from: "Магдаля",
        to: "Лужская",
        status: "РАВНО",
        wagonCount: 2,
        distance: 1300,
      },
    ];

    return routes;
  };

  const routes = getRoutesData();

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-4">
      <div className="lg:col-span-3 p-4 border-r">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold">Карта перевозок</h2>

          <div className="flex gap-2">
            <Select value={mapType} onValueChange={setMapType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Тип карты" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routes">Маршруты</SelectItem>
                <SelectItem value="stations">Станции</SelectItem>
                <SelectItem value="heatmap">Тепловая карта</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Колонка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все колонки</SelectItem>
                <SelectItem value="demand">Спрос</SelectItem>
                <SelectItem value="optimizerPlan">План оптимизатора</SelectItem>
                <SelectItem value="projectPlan">Проект плана</SelectItem>
                <SelectItem value="approvedPlan">Согласованный план</SelectItem>
                <SelectItem value="execution">Факт исполнения</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowLegend(!showLegend)}
            >
              <Layers size={18} />
            </Button>
          </div>
        </div>

        <div className="relative h-[calc(100%-3rem)] rounded-lg border bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MapPin size={64} className="mx-auto mb-4" />
              <p className="text-lg font-medium">
                Интерактивная карта маршрутов
              </p>
              <p className="mt-2">
                Здесь будет отображаться карта с маршрутами перевозок
              </p>
            </div>
          </div>

          {showLegend && (
            <div className="absolute bottom-4 right-4 w-64 rounded-lg border bg-white p-3 shadow-md">
              <h3 className="mb-2 font-medium">Легенда</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Обеспечен</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">С корректировкой</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Не обеспечен</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Не распределен</span>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-gray-500" />
                  <span className="text-sm">Автомобильный транспорт</span>
                </div>
                <div className="flex items-center gap-2">
                  <Train size={16} className="text-gray-500" />
                  <span className="text-sm">Железнодорожный транспорт</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ship size={16} className="text-gray-500" />
                  <span className="text-sm">Морской транспорт</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-4 text-lg font-medium">Маршруты</h3>

        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">Фильтры:</span>
          <div className="flex items-center gap-1">
            <Checkbox id="filter-all" defaultChecked />
            <label htmlFor="filter-all" className="text-sm">
              Все
            </label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox id="filter-active" />
            <label htmlFor="filter-active" className="text-sm">
              Активные
            </label>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="space-y-3">
            {routes.map((route) => (
              <Card key={route.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Маршрут #{route.id}</div>
                  <Badge
                    className={cn("font-normal", getStatusColor(route.status))}
                  >
                    {route.status}
                  </Badge>
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-gray-500" />
                  <span>{route.from}</span>
                  <span className="text-gray-400">→</span>
                  <span>{route.to}</span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-500">
                  <div>Вагонов: {route.wagonCount}</div>
                  <div>Расстояние: {route.distance} км</div>
                </div>

                <Button variant="outline" size="sm" className="mt-2 w-full">
                  Подробнее
                </Button>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
