import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { api, NotificationItem } from "../lib/api";
import { getToken } from "../lib/auth";

const socketUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin;

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const seenIds = useRef(new Set<number>());

  const loadNotifications = useCallback(async () => {
    if (!getToken()) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const response = await api.get<NotificationItem[]>("/notifications");
      setNotifications(response.data);
      setUnreadCount(response.data.filter((notification) => !notification.readAt).length);
    } catch {
      // Socket vẫn có thể kết nối lại nếu API polling tạm thời lỗi.
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = window.setInterval(loadNotifications, 10_000);
    const token = getToken();
    if (!token) return () => window.clearInterval(interval);

    const socket: Socket = io(socketUrl, { auth: { token }, transports: ["websocket", "polling"] });
    const onNotification = (notification: NotificationItem) => {
      if (seenIds.current.has(notification.id)) return;
      seenIds.current.add(notification.id);
      setNotifications((current) => [notification, ...current.filter((item) => item.id !== notification.id)].slice(0, 30));
      if (!notification.readAt) setUnreadCount((count) => count + 1);
      toast(notification.message, { icon: "🔔", duration: 6000 });
    };
    socket.on("notification:new", onNotification);

    return () => {
      window.clearInterval(interval);
      socket.off("notification:new", onNotification);
      socket.disconnect();
    };
  }, [loadNotifications]);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((current) => current.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item));
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch {
      // Giữ trạng thái local nếu request bị gián đoạn.
    }
  }, []);

  return { notifications, unreadCount, markAsRead, reload: loadNotifications };
}
