'use client'

import { useState } from "react";
import ChatInterface from "./ChatInterface";
import { Message } from "@/types/dashboard/chat";
import { useTranslations } from "next-intl";


export default function SupportChats() {
  const t = useTranslations('dashboard.support');
  const supportUser = {
    id: 99,
    imageSrc: "/users/default-user.png",
    name: t('senderName'),
    lastMessage: t('lastMessage'),
  };

  const supportMessages: Record<number, Message[]> = {
    99: [
      {
        sender: t('senderName'),
        role: "support",
        timestamp: "Oct 18, 2025, 1:00 PM",
        content: t('welcomeMessage'),
      },
    ],
  };
  const [messagesMap, setMessagesMap] = useState<Record<number, Message[]>>(supportMessages);
  return (
    <div className="container">
      <ChatInterface
        users={[supportUser]}
        messagesMap={messagesMap}
        onUpdateMessages={(chatId, newMessages) =>
          setMessagesMap((prev) => ({ ...prev, [chatId]: newMessages }))
        }
      />
    </div>
  );
}
