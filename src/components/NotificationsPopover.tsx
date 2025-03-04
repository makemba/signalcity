
import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck, Clock, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNotifications } from "@/contexts/NotificationsContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isPushEnabled,
    togglePushNotifications
  } = useNotifications();

  // Ferme automatiquement après avoir marqué comme lu
  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
  };

  const handleDeleteNotification = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(id);
    toast({
      title: "Notification supprimée",
      description: "La notification a été supprimée avec succès",
    });
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "info":
        return <Bell className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <Check className="h-4 w-4 text-green-500" />;
      case "error":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBgColorForType = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-50";
      case "warning":
        return "bg-yellow-50";
      case "success":
        return "bg-green-50";
      case "error":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };

  useEffect(() => {
    if (!open) return;
    const readNotificationIds = notifications
      .filter(n => !n.read)
      .map(n => n.id);
    
    if (readNotificationIds.length > 0) {
      const timer = setTimeout(() => {
        readNotificationIds.forEach(id => markAsRead(id));
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [open, notifications, markAsRead]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0 max-h-[500px] flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center space-x-2">
            <Button
              onClick={markAllAsRead}
              variant="ghost"
              size="sm"
              disabled={unreadCount === 0}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              <span className="text-xs">Tout lire</span>
            </Button>
          </div>
        </div>
        <Separator />
        
        {/* Settings for push notifications */}
        <div className="p-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-gray-500" />
              <Label htmlFor="push-toggle" className="text-sm font-medium">
                Notifications push
              </Label>
            </div>
            <Switch
              id="push-toggle"
              checked={isPushEnabled}
              onCheckedChange={togglePushNotifications}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isPushEnabled 
              ? "Vous recevrez des notifications en temps réel" 
              : "Activez pour recevoir des notifications en temps réel"}
          </p>
        </div>
        
        {/* Notification list */}
        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>Aucune notification</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    !notification.read ? "bg-blue-50" : ""
                  } ${getBgColorForType(notification.type)}`}
                >
                  <div className="flex items-start">
                    <div className="mt-0.5 mr-3">{getIconForType(notification.type)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <div className="flex items-center">
                          <button
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="text-gray-400 hover:text-red-500 ml-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
