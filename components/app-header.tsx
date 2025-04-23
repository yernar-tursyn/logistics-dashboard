import {
  Bell,
  Calendar,
  ChevronDown,
  HelpCircle,
  Search,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function AppHeader() {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="mr-4 text-xl font-bold text-[#b1053d]">ECT</div>

          <nav className="hidden md:flex">
            <Button variant="ghost" className="text-sm font-medium">
              Планирование
            </Button>
            <Button variant="ghost" className="text-sm font-medium">
              Аналитика
            </Button>
            <Button variant="ghost" className="text-sm font-medium">
              Отчеты
            </Button>
            <Button
              variant="ghost"
              className="text-sm font-medium flex items-center"
            >
              Еще <ChevronDown size={14} className="ml-1" />
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Поиск..."
              className="w-64 rounded-full bg-gray-50 pl-8 focus-visible:ring-[#b1053d]"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#b1053d] p-0 text-[10px]">
              3
            </Badge>
          </Button>

          <Button variant="ghost" size="icon">
            <Calendar size={20} />
          </Button>

          <Button variant="ghost" size="icon">
            <Settings size={20} />
          </Button>

          <Button variant="ghost" size="icon">
            <HelpCircle size={20} />
          </Button>

          <div className="ml-2 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-[#b1053d] text-white">
                ЛО
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-sm md:block">
              <div className="font-medium">Логист Оператор</div>
              <div className="text-xs text-gray-500">Диспетчер</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
