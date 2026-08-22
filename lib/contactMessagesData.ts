"use client";

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  submittedAt: string;
  status: "NEW" | "CONTACTED" | "RESOLVED" | "ARCHIVED";
  notes?: string;
}

export const initialContactMessages: ContactMessage[] = [
  {
    id: "MSG-1001",
    name: "Dr. Farhana Ahmed",
    phone: "+880 1712-889900",
    email: "farhana.ahmed@gmail.com",
    message: "We have a 4,500 sqft corporate medical diagnostic center in Gulshan-1. We need daily morning sanitization & floor polishing service starting next month. Please send a B2B proposal.",
    submittedAt: "2026-08-22 07:30 AM",
    status: "NEW",
    notes: "",
  },
  {
    id: "MSG-1002",
    name: "Kamrul Islam",
    phone: "+880 1819-445566",
    email: "kamrul.dev@techhub.bd",
    message: "Moving out of our 2,200 sqft apartment in Banani DOHS on Friday. Need a full deep clean service including kitchen chimney, window glass, and sofa shampooing.",
    submittedAt: "2026-08-21 04:15 PM",
    status: "CONTACTED",
    notes: "Spoke via phone. Customer requested Friday 10 AM slot.",
  },
  {
    id: "MSG-1003",
    name: "Syeda Nusrat Zahan",
    phone: "+880 1911-223344",
    email: "nusrat.zahan@outlook.com",
    message: "I am interested in your Standard Monthly Subscription Plan for my 3-bedroom apartment in Uttara Sector 4. Is water & electricity supplied by us or team?",
    submittedAt: "2026-08-20 11:20 AM",
    status: "RESOLVED",
    notes: "Answered questions via email. Client subscribed to Standard Plan.",
  },
  {
    id: "MSG-1004",
    name: "Tariqul Hasan",
    phone: "+880 1733-556677",
    email: "tariq.hasan@construction.com.bd",
    message: "Post-construction cleaning required for a 6-story commercial building near Tejgaon Industrial Area. Floor scrubbing, exterior glass cleaning, and debris removal required.",
    submittedAt: "2026-08-19 02:45 PM",
    status: "NEW",
    notes: "",
  },
];

const STORAGE_KEY = "cleanix_contact_messages_v1";

export function getStoredContactMessages(): ContactMessage[] {
  if (typeof window === "undefined") return initialContactMessages;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialContactMessages));
      return initialContactMessages;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse contact messages from localStorage:", e);
    return initialContactMessages;
  }
}

export function saveContactMessages(messages: ContactMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    window.dispatchEvent(new Event("cleanix_contact_messages_updated"));
  } catch (e) {
    console.error("Failed to save contact messages to localStorage:", e);
  }
}

export function addContactMessage(data: {
  name: string;
  phone: string;
  email: string;
  message: string;
}): ContactMessage {
  const current = getStoredContactMessages();
  const newMsg: ContactMessage = {
    id: `MSG-${1000 + current.length + 1}`,
    name: data.name,
    phone: data.phone,
    email: data.email,
    message: data.message,
    submittedAt: new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    status: "NEW",
    notes: "",
  };

  const updated = [newMsg, ...current];
  saveContactMessages(updated);
  return newMsg;
}

export function updateContactMessageStatus(
  id: string,
  status: ContactMessage["status"],
  notes?: string
): ContactMessage[] {
  const current = getStoredContactMessages();
  const updated = current.map((m) =>
    m.id === id ? { ...m, status, notes: notes !== undefined ? notes : m.notes } : m
  );
  saveContactMessages(updated);
  return updated;
}

export function deleteContactMessage(id: string): ContactMessage[] {
  const current = getStoredContactMessages();
  const updated = current.filter((m) => m.id !== id);
  saveContactMessages(updated);
  return updated;
}
