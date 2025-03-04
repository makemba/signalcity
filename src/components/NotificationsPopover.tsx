
import React, { useState } from "react";
import { Bell, MailCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/contexts/NotificationsContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NotificationsPopoverProps {
  children?: React.ReactNode;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead, markAsRead, deleteNotification, isPushEnabled, togglePushNotifications } = useNotifications();

  const handleDeleteClick = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(id);
    toast.success("Notification supprimée");
  };

  const handleNotificationClick = async (id: number) => {
    await markAsRead(id);
    setOpen(false);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    toast.success("Toutes les notifications ont été marquées comme lues");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePushNotifications}
              title={isPushEnabled ? "Désactiver les notifications" : "Activer les notifications"}
            >
              <Bell className={cn("h-4 w-4", isPushEnabled ? "text-primary" : "text-muted-foreground")} />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                title="Marquer tout comme lu"
              >
                <MailCheck className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="max-h-[300px] overflow-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucune notification pour le moment
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={cn(
                    "flex p-3 border-b last:border-b-0 gap-3 cursor-pointer hover:bg-muted/50",
                    !notification.read && "bg-muted/20"
                  )}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm">{notification.title}</div>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full hover:bg-muted-foreground/20"
                          onClick={(e) => handleDeleteClick(notification.id, e)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <div className="text-xs text-muted-foreground/70 mt-1">
                      {notification.createdAt && formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
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
};

export default NotificationsPopover;
