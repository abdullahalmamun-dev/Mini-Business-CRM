import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:5000'); 

    socket.on('notification', (notification) => {

      if (notification.userId === user.id || user.role === 'Admin') {
        setNotifications(prev => [notification, ...prev].slice(0, 5));
        setUnreadCount(prev => prev + 1);
        

        if (Notification.permission === 'granted') {
          new Notification('MiniCRM Update', { body: notification.message });
        }
      }
    });

    return () => socket.disconnect();
  }, [user]);

  const clearUnread = () => setUnreadCount(0);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, clearUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
