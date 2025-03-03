
import { Bell, BellOff, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/contexts/NotificationsContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function NotificationsPopover() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    requestPushPermission,
    isPushEnabled
  } = useNotifications();
  console.log('NotificationsPopover rendered', { unreadCount });
  
  const [isActivating, setIsActivating] = useState(false);

  const handleTogglePushNotifications = async () => {
    if (isPushEnabled) {
      toast.info("Les notifications push sont déjà activées");
      return;
    }
    
    setIsActivating(true);
    try {
      const granted = await requestPushPermission();
      if (!granted) {
        toast.error("Vous devez autoriser les notifications dans votre navigateur");
      }
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => markAllAsRead()}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPushEnabled ? (
                <BellRing className="h-4 w-4 text-green-500" />
              ) : (
                <BellOff className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm">Notifications push</span>
            </div>
            <Switch 
              checked={isPushEnabled} 
              disabled={isActivating || isPushEnabled}
              onCheckedChange={handleTogglePushNotifications}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isPushEnabled 
              ? "Vous recevrez des notifications en temps réel" 
              : "Activez pour recevoir des alertes même lorsque l'application est en arrière-plan"}
          </p>
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Aucune notification
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-gray-50 transition-colors cursor-pointer",
                    !notification.read && "bg-blue-50/50"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-500">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
