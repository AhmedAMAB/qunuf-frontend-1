'use client';

import ChatPreviewCard from "@/components/dashboard/chats/ChatPreviewCard";
import { updateUrlParams } from "@/utils/helpers";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { MdFilterList } from "react-icons/md";
import DesktopChatPanel from "./DesktopChatPanel";
import MobileChatPanel from "./MobileChatPanel";
import { Message, User } from "@/types/dashboard/chat";
import { useTranslations } from "next-intl";


interface ChatInterfaceProps {
    users: User[];
    messagesMap: Record<number, Message[]>;
    onUpdateMessages: (chatId: number, newMessages: Message[]) => void;
}

export default function ChatInterface({
    users,
    messagesMap,
    onUpdateMessages,
}: ChatInterfaceProps) {
    const t = useTranslations('dashboard.chats');

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialChatId = searchParams.get("chat") ? Number(searchParams.get("chat")) : undefined;
    const [selectedChatId, setSelectedChatId] = useState<number | undefined>(initialChatId);

    const selectedUser = users?.find((u) => u.id === selectedChatId);

    const handleSelectChat = (id: number) => {
        setSelectedChatId(id);
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("chat", id.toString());
        updateUrlParams(pathname, newParams);
    };

    const handleSendMessage = (content: string) => {
        if (!selectedChatId) return;
        const newMessage: Message = {
            sender: "Bassem",
            role: "host",
            timestamp: new Date().toISOString(),
            content,
        };

        const updatedMessages = [...(messagesMap[selectedChatId] || []), newMessage];
        onUpdateMessages(selectedChatId, updatedMessages);
    };


    return (
        <div className="flex-1  grid grid-cols-1 md:grid-cols-12 mx-auto px-4 py-6  gap-6 h-full">
            {/* Sidebar */}
            <div className=" md:col-span-6 lg:col-span-5 xl:col-span-4">
                <div className="">
                    <div className="flex justify-between pb-4 items-center border-b border-b-gray">
                        <h2 className="text-lg font-bold text-center text-gray-800">{t('messages')}</h2>
                        <MdFilterList size={24} className="text-secondary" />
                    </div>
                    <div className="space-y-4 overflow-auto h-[calc(100vh-240px)] thin-scrollbar max-md:border-none border-e border-gray">
                        {users?.map((user) => (
                            <ChatPreviewCard
                                key={user.id}
                                imageSrc={user.imageSrc}
                                name={user.name}
                                lastMessage={user.lastMessage}
                                selected={user.id === selectedChatId}
                                onClick={() => handleSelectChat(user.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <DesktopChatPanel
                selectedUser={selectedUser}
                selectedChatId={selectedChatId}
                messagesMap={messagesMap}
                handleSendMessage={handleSendMessage}
            />

            <MobileChatPanel
                selectedUser={selectedUser}
                selectedChatId={selectedChatId}
                messagesMap={messagesMap}
                handleSendMessage={handleSendMessage}
                handleCloseThread={() => setSelectedChatId(undefined)}
                isOpen={selectedChatId !== undefined}
            />

        </div>
    );

}
