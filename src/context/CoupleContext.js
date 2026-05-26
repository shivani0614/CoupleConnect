// src/context/CoupleContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { INIT_TASKS, INIT_MESSAGES, INIT_NOTES, AUTO_REPLIES } from '../data';

const CoupleContext = createContext(null);

function fmtTime() {
  const d = new Date();
  const h = d.getHours() % 12 || 12;
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m} ${d.getHours() < 12 ? 'AM' : 'PM'}`;
}

export function CoupleProvider({ children }) {
  const [tasks,    setTasks]    = useState(INIT_TASKS);
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [notes,    setNotes]    = useState(INIT_NOTES);
  const [mood,     setMood]     = useState('💑 In love');
  const [kisses,   setKisses]   = useState(24);

  const toggleTask = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const addTask = useCallback((text, who = 'Both') => {
    const id = Date.now().toString();
    setTasks(prev => [...prev, { id, text, who, done: false }]);
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const sendMessage = useCallback((text, me = true) => {
    const id = Date.now().toString();
    setMessages(prev => [...prev, { id, me, text, ts: fmtTime() }]);
    if (me) {
      setTimeout(() => {
        const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
        setMessages(prev => [...prev, {
          id: Date.now().toString(), me: false, text: reply, ts: fmtTime(),
        }]);
      }, 1000 + Math.random() * 700);
    }
  }, []);

  const addNote = useCallback((text, from = 'You') => {
    const colorIdx = notes.length % 6;
    setNotes(prev => [...prev, { id: Date.now().toString(), from, text, colorIdx }]);
  }, [notes.length]);

  const sendHug  = useCallback(() => sendMessage('🤗 Sending you the biggest hug!', true), [sendMessage]);
  const sendKiss = useCallback(() => { setKisses(k => k + 1); sendMessage('💋 Mwah!', true); }, [sendMessage]);

  return (
    <CoupleContext.Provider value={{
      tasks, toggleTask, addTask, deleteTask,
      messages, sendMessage,
      notes, addNote,
      mood, setMood,
      kisses, sendHug, sendKiss,
    }}>
      {children}
    </CoupleContext.Provider>
  );
}

export const useCouple = () => {
  const ctx = useContext(CoupleContext);
  if (!ctx) throw new Error('useCouple must be used within CoupleProvider');
  return ctx;
};
