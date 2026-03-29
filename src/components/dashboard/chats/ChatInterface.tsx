'use client';

import React, { memo, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Virtuoso } from 'react-virtuoso';
import { SortedSet } from '@rimbu/sorted';
import { ConversationOrder } from '@/utils/compare';
import { ConversationChat, useChat } from '@/hooks/dashboard/useChat';
import { formatLastMessageTime } from '@/utils/date';
import { resolveUrl } from '@/utils/upload';
import ChatPanel from './ChatPanel';
import {
    LucideMessageSquare,
    LucideLoader2,
    LucideInbox,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ChatSidebarProps {
    loadingConversations: boolean;
    sortedConversationsIds: SortedSet<ConversationOrder>;
    conversationsMap: Map<string, ConversationChat>;
    handleSelectChat: (id: string) => void;
    fetchMoreConversations: () => void;
    currentOpenConversationId: string | null;
    isSending: Map<string, boolean>;
}

interface ChatPreviewProps {
    conversation: ConversationChat;
    onClick?: () => void;
    selected: boolean;
    isSending?: boolean;
}

// ─── ChatPreviewCard ───────────────────────────────────────────────────────────

function ChatPreviewCard({
    onClick,
    selected,
    conversation,
    isSending = false,
}: ChatPreviewProps) {
    const tSupport = useTranslations('dashboard.support');
    const t = useTranslations('comman');

    const isSupport = conversation.supportUserId === conversation?.partner?.id;
    const displayName = isSupport ? tSupport('senderName') : conversation?.partner?.name;
    const hasUnread = !isSending && conversation?.myUnreadCount > 0;

    return (
        <div
            role="button"
            tabIndex={0}
            aria-selected={selected}
            onClick={onClick}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
            className={`
                relative flex items-center gap-3 px-3 py-3 mx-2 my-0.5
                rounded-xl cursor-pointer
                transition-all duration-150
                border border-transparent
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]/40
                ${selected
                    ? 'bg-[var(--lighter)] border-[var(--gray)]'
                    : 'hover:bg-[var(--highlight)]'
                }
                ${isSending ? 'opacity-60' : ''}
            `}
        >
            {/* Selected indicator bar */}
            {selected && (
                <span className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-[var(--secondary)]" />
            )}

            {/* Avatar */}
            <div className={`
                relative shrink-0 w-11 h-11 rounded-full overflow-hidden
                bg-[var(--gray)] ring-2
                ${selected ? 'ring-[var(--secondary)]/30' : 'ring-transparent'}
                transition-all duration-150
            `}>
                <Image
                    src={resolveUrl(conversation?.partner?.imagePath) || '/users/default-user.png'}
                    alt={displayName ?? ''}
                    width={44}
                    height={44}
                    className={`w-full h-full object-cover transition-opacity duration-200 ${isSending ? 'opacity-40' : 'opacity-100'}`}
                />
                {isSending && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                        <LucideLoader2 size={16} className="animate-spin text-[var(--secondary)]" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                {/* Row 1: name + time */}
                <div className="flex items-center justify-between gap-2">
                    <h4 className={`
                        text-sm truncate
                        ${hasUnread ? 'font-bold text-[var(--dark)]' : 'font-semibold text-[var(--dark)]'}
                    `}>
                        {displayName}
                    </h4>
                    {!isSending && conversation?.lastMessage && (
                        <span className="text-[10px] text-[var(--placeholder)] whitespace-nowrap shrink-0">
                            {formatLastMessageTime(conversation.lastMessage.created_at, t)}
                        </span>
                    )}
                </div>

                {/* Row 2: preview + unread badge */}
                <div className="flex items-center justify-between gap-2">
                    {isSending ? (
                        <p className="text-xs text-[var(--placeholder)] italic truncate">
                            {t('sending')}
                        </p>
                    ) : conversation?.lastMessage?.content ? (
                        <p className={`text-xs flex-1 truncate ${hasUnread ? 'text-[var(--dark)] font-medium' : 'text-[var(--placeholder)]'}`}>
                            {conversation.lastMessage.content}
                        </p>
                    ) : null}

                    {/* Unread badge */}
                    {hasUnread && (
                        <span className="
                            shrink-0 inline-flex items-center justify-center
                            min-w-[18px] h-[18px] px-1 rounded-full
                            bg-[var(--primary)] text-white
                            text-[9px] font-bold
                        ">
                            {conversation.myUnreadCount > 99 ? '99+' : conversation.myUnreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── ChatPreviewSkeleton ───────────────────────────────────────────────────────

export function ChatPreviewSkeleton() {
    return (
        <div className="flex items-center gap-3 px-3 py-3 mx-2 my-0.5 rounded-xl animate-pulse">
            <div className="shrink-0 w-11 h-11 rounded-full bg-[var(--gray)]" />
            <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between gap-4">
                    <div className="h-3 bg-[var(--gray)] rounded-full w-1/3" />
                    <div className="h-3 bg-[var(--gray)] rounded-full w-10" />
                </div>
                <div className="h-2.5 bg-[var(--lighter)] rounded-full w-2/3" />
            </div>
        </div>
    );
}

// ─── ChatSidebar ───────────────────────────────────────────────────────────────

const ChatSidebar = memo(function ChatSidebar({
    loadingConversations,
    sortedConversationsIds,
    conversationsMap,
    handleSelectChat,
    currentOpenConversationId,
    isSending,
    fetchMoreConversations,
}: ChatSidebarProps) {
    const t = useTranslations('dashboard.chats');

    const virtuosoData = useMemo(
        () => sortedConversationsIds.toArray().map(({ id }) => conversationsMap.get(id)),
        [sortedConversationsIds, conversationsMap]
    );

    const isEmpty = !loadingConversations && sortedConversationsIds.size === 0;
    const isInitialLoading = loadingConversations && sortedConversationsIds.size === 0;
    const hasList = sortedConversationsIds.size > 0;

    const listHeight = 'calc(100vh - 200px)';

    return (
        <div className="flex flex-col h-full bg-[var(--card-bg)] rounded-2xl border border-[var(--gray)] overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--gray)] shrink-0">
                <div className="flex items-center gap-2">
                    <LucideMessageSquare size={17} className="text-[var(--secondary)]" />
                    <h2 className="text-sm font-bold text-[var(--dark)]">
                        {t('messages')}
                    </h2>
                </div>
                {hasList && (
                    <span className="
                        inline-flex items-center justify-center
                        min-w-[22px] h-[22px] px-1.5 rounded-full
                        bg-[var(--secondary)] text-white
                        text-[10px] font-bold
                    ">
                        {sortedConversationsIds.size > 99 ? '99+' : sortedConversationsIds.size}
                    </span>
                )}
            </div>

            {/* Initial loading skeletons */}
            {isInitialLoading && (
                <div style={{ height: listHeight }} className="overflow-hidden">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <ChatPreviewSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {isEmpty && (
                <div
                    style={{ height: listHeight }}
                    className="flex flex-col items-center justify-center gap-3 px-6 text-center"
                >
                    <div className="w-12 h-12 rounded-2xl bg-[var(--lighter)] border border-[var(--gray)] flex items-center justify-center">
                        <LucideInbox size={22} className="text-[var(--secondary)]" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-[var(--dark)]">
                            {t('noConversationsYet')}
                        </p>
                        <p className="text-xs text-[var(--placeholder)] max-w-[180px]">
                            {t('startMessagingToSeeChats')}
                        </p>
                    </div>
                </div>
            )}

            {/* Virtualized list */}
            {hasList && (
                <Virtuoso
                    style={{ height: listHeight }}
                    className="py-1"
                    data={virtuosoData}
                    endReached={() => { if (!loadingConversations) fetchMoreConversations(); }}
                    increaseViewportBy={200}
                    itemContent={(_index, conv) => {
                        if (!conv) return null;
                        const conversation = conversationsMap.get(conv.id);
                        if (!conversation) return null;
                        const sending = isSending.get(conv.id) || false;

                        return (
                            <ChatPreviewCard
                                key={conv.id}
                                selected={conversation.id === currentOpenConversationId}
                                isSending={sending}
                                conversation={conversation}
                                onClick={() => handleSelectChat(conversation.id)}
                            />
                        );
                    }}
                    components={{
                        Footer: () =>
                            loadingConversations && sortedConversationsIds.size > 0 ? (
                                <div className="flex items-center justify-center gap-2 py-4">
                                    <LucideLoader2 size={14} className="animate-spin text-[var(--secondary)]" />
                                    <span className="text-xs text-[var(--placeholder)]">
                                        {t('loadingMore')}
                                    </span>
                                </div>
                            ) : null,
                    }}
                />
            )}
        </div>
    );
});

export { ChatSidebar };

// ─── ChatInterface ─────────────────────────────────────────────────────────────

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
    } = useChat();

    return (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-4 h-full">

            {/* Sidebar — hidden on mobile when a chat is open */}
            <div className={`
                md:col-span-5 lg:col-span-4 xl:col-span-3
                ${currentOpenConversationId ? 'hidden md:block' : 'block'}
            `}>
                <ChatSidebar
                    fetchMoreConversations={fetchMoreConversations}
                    isSending={isSending}
                    conversationsMap={conversationsMap}
                    currentOpenConversationId={currentOpenConversationId}
                    handleSelectChat={handleSelectChat}
                    loadingConversations={loadingConversations}
                    sortedConversationsIds={sortedConversationsIds}
                />
            </div>

            {/* Chat panel */}
            <div className={`
                md:col-span-7 lg:col-span-8 xl:col-span-9
                ${!currentOpenConversationId ? 'hidden md:block' : 'block'}
            `}>
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

        </div>
    );
}