// src/app/App.tsx

import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectAllUsers,
} from "../store/selectors/userSelectors";
import { setCurrentUser } from "../store/slices/userSlice";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Users,
  Clock,
  User as UserIcon,
  Settings,
  Database,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { User } from "../entities/user/types";
import {
  getAvailableTabs,
  getTabPath,
  getActiveTabFromPath,
  TabType,
} from "../lib/utils/rolePermissions";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(selectCurrentUser);
  const allUsers = useSelector(selectAllUsers);
  const dispatch = useDispatch();

  if (!currentUser) {
    return <div>Загрузка...</div>;
  }

  // ✅ Получаем доступные табы для текущей роли
  const availableTabs = getAvailableTabs(currentUser.role);
  
  // ✅ Определяем активный таб по текущему пути
  const activeTab = getActiveTabFromPath(location.pathname);

  // ✅ Обработчик переключения табов
  const handleTabChange = (value: string) => {
    const tabPath = getTabPath(value as TabType);
    navigate(tabPath);
  };

  // ✅ Функция для получения иконки таба
  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case "my-time":
        return Clock;
      case "team-time":
        return Users;
      case "directory":
        return Settings;
      case "init":
        return Database;
      default:
        return Clock;
    }
  };

  // ✅ Функция для получения названия таба
  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case "my-time":
        return "Мои часы";
      case "team-time":
        return "Часы команды";
      case "directory":
        return "Справочники";
      case "init":
        return "Инициализация";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h1 className="text-slate-900">Учет времени</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                <UserIcon className="w-4 h-4 text-slate-600" />
                <div>
                  <div className="text-sm text-slate-900">
                    {currentUser.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {currentUser.position}
                  </div>
                </div>
              </div>

              {/* Новый селектор */}
              <Select
                value={currentUser.id}
                onValueChange={(value: string) => dispatch(setCurrentUser(value))}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Выбрать пользователя" />
                </SelectTrigger>
                <SelectContent>
                  {allUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Tabs - показываем для всех ролей, но с разными наборами табов */}
      {availableTabs.length > 0 && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-[1600px] mx-auto px-6">
            <Tabs value={activeTab} onValueChange={(value: string) => handleTabChange(value as TabType)}>
              <TabsList className="bg-transparent border-0 h-auto p-0">
                {availableTabs.map((tab) => {
                  const Icon = getTabIcon(tab);
                  return (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {getTabLabel(tab)}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}

      {/* Content */}
      <Outlet context={{ currentUser }} />
    </div>
  );
}
