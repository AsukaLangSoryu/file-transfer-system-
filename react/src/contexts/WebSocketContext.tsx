import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { createWebSocket } from '../lib/api';

interface WebSocketContextType {
  ws: WebSocket | null;
  onlineUsers: any[];
  addMessageHandler: (id: string, handler: (data: any) => void) => void;
  removeMessageHandler: (id: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  ws: null,
  onlineUsers: [],
  addMessageHandler: () => {},
  removeMessageHandler: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const handlersRef = useRef<Map<string, (data: any) => void>>(new Map());

  useEffect(() => {
    const socket = createWebSocket(
      (data) => {
        if (data.type === 'users_update') {
          setOnlineUsers(data.users);
        }
        handlersRef.current.forEach(handler => handler(data));
      },
      () => {
        let userName = localStorage.getItem('userName');
        if (!userName) {
          userName = prompt("请输入你的名称：") || `用户${Math.floor(Math.random() * 1000)}`;
          localStorage.setItem('userName', userName);
        }
        socket.send(JSON.stringify({
          type: 'register',
          user: { name: userName, ip: 'Auto', type: 'desktop' }
        }));
      }
    );
    setWs(socket);
    return () => socket.close();
  }, []);

  const addMessageHandler = (id: string, handler: (data: any) => void) => {
    handlersRef.current.set(id, handler);
  };

  const removeMessageHandler = (id: string) => {
    handlersRef.current.delete(id);
  };

  return (
    <WebSocketContext.Provider value={{ ws, onlineUsers, addMessageHandler, removeMessageHandler }}>
      {children}
    </WebSocketContext.Provider>
  );
};
