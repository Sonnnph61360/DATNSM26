import { serialize } from "./serialize";

let io = null;

export function configureNotificationSocket(socketServer) {
  io = socketServer;
}

export function emitNotification(notification) {
  if (!io || !notification) return;
  const payload = serialize(notification);
  const rooms = [];
  if (notification.userId) rooms.push(`user:${Number(notification.userId)}`);
  if (notification.email) rooms.push(`email:${String(notification.email).toLowerCase()}`);
  if (rooms.length) {
    let target = io;
    for (const room of rooms) target = target.to(room);
    target.emit("notification:new", payload);
  }
}
