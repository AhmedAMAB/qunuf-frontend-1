'use client';

import React from "react";
import ChatSidebar from "./ChatSidebar";
import { useChat } from "@/hooks/dashboard/useChat";
import ChatPanel from "./ChatPanel";


export default function ChatInterface() {

    const {
        sortedConversationsIds,
        conversationsMap,
        currentOpenConversationId,
        handleSelectChat,
        currentConversation,
        currentConversationMessages,
        loadingConversations,
        loadingMessageId,
        sendMessage,
        retryMessage,
        loadingMoreId,
        loadMoreMessages,
        isSending,
        markAsRead,
        fetchMoreConversations,
    } = useChat()


    // return <App1 />
    return (
        <div className="flex-1  grid grid-cols-1 md:grid-cols-12 mx-auto px-4 py-6  gap-6 h-full">
            {/* Sidebar */}
            <div className=" md:col-span-6 lg:col-span-5 xl:col-span-4">
                <ChatSidebar
                    fetchMoreConversations={fetchMoreConversations}
                    isSending={isSending}
                    conversationsMap={conversationsMap}
                    currentOpenConversationId={currentOpenConversationId}
                    handleSelectChat={handleSelectChat}
                    loadingConversations={loadingConversations}
                    sortedConversationsIds={sortedConversationsIds} />
            </div>

            <ChatPanel
                markAsRead={markAsRead}
                loadingMoreId={loadingMoreId}
                loadMoreMessages={loadMoreMessages}
                loadingMessageId={loadingMessageId}
                retryMessage={retryMessage}
                currentOpenConversationId={currentOpenConversationId}
                selectedUser={currentConversation?.partner}
                isPartnerAdmin={currentConversation?.partner.id === currentConversation?.supportUserId}
                selectedChatId={currentOpenConversationId}
                messages={currentConversationMessages}
                handleSendMessage={(content) => sendMessage(currentOpenConversationId || '', content)}
                handleCloseThread={() => handleSelectChat(null)}
                isOpen={!!currentOpenConversationId}
            />



        </div>
    );

}
