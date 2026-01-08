
import { Message } from "@/types/dashboard/chat";
import ConversationThread, { MessageSkeleton } from "./ConversationThread";
import EmptyChatState from "./EmptyChatState";
import { User } from "@/types/dashboard/user";
import { Component, memo, useMemo } from "react";
import React, { useRef, useState, useCallback } from "react";
import VirtualMessageRow from "./VirtualMessageRow";
import { useAuth } from "@/contexts/AuthContext";
import MessagesLoading from "./MessagesLoading";




interface DesktopChatPanelProps {
    selectedUser?: User;
    selectedChatId: string | null;
    messages: {
        items: Message[];
        hasMore: boolean;
        nextCursor: string | null;
    } | null;
    handleSendMessage: (content: string) => void;
    loadingMessageId: string | null;
    currentOpenConversationId: string | null;
    retryMessage?: (msg: Message) => void;
    loadMoreMessages?: (conversationId: string) => Promise<number>;
    markAsRead?: (conversationId: string) => Promise<void>;
    loadingMoreId?: string | null;
    isPartnerAdmin?: boolean;
}

const DesktopChatPanel = memo(function DesktopChatPanel({
    selectedUser,
    selectedChatId,
    loadingMessageId,
    currentOpenConversationId,
    messages,
    handleSendMessage,
    retryMessage,
    loadMoreMessages,
    loadingMoreId,
    markAsRead,
    isPartnerAdmin
}: DesktopChatPanelProps) {

    if (loadingMessageId?.startsWith('new-chat')) {
        return (
            <MessagesLoading />
        );
    }

    return (
        <div className="hidden md:block md:col-span-6 lg:col-span-7 xl:col-span-8 bg-white  rounded-[8px] relative">
            {selectedUser ? (
                <ConversationThread
                    isPartnerAdmin={isPartnerAdmin}
                    markAsRead={markAsRead}
                    loadingMoreId={loadingMoreId}
                    loadMoreMessages={loadMoreMessages}
                    retryMessage={retryMessage}
                    currentOpenConversationId={currentOpenConversationId}
                    loadingMessageId={loadingMessageId}
                    className="h-full overflow-hidden px-4 py-6"
                    messages={messages?.items || []}
                    participant={selectedUser}
                    onSendMessage={handleSendMessage}
                />
            ) : (
                <EmptyChatState />
            )}
        </div>
    );
})

export default DesktopChatPanel;
