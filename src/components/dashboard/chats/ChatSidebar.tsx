import { useTranslations } from "next-intl";
import { MdFilterList } from "react-icons/md";
import ChatPreviewCard from "./ChatPreviewCard";
import { ConversationChat } from "@/hooks/dashboard/useChat";
import { memo } from "react";
import { Virtuoso } from "react-virtuoso";

interface ChatSidebarProps {
    loadingConversations: boolean;
    sortedConversationsIds: { id: string; sortId: string }[];
    conversationsMap: Map<string, ConversationChat>; // Enforces using Map, not Object
    handleSelectChat: (id: string) => void;
    fetchMoreConversations: () => void;
    currentOpenConversationId: string | null;
    isSending: Map<string, boolean>;
}

const ChatSidebar = memo(function ChatSidebar({
    loadingConversations,
    sortedConversationsIds,
    conversationsMap,
    handleSelectChat,
    currentOpenConversationId,
    isSending,
    fetchMoreConversations,
}: ChatSidebarProps) {
    const t = useTranslations("dashboard.chats");

    function fetchMore() {
        if (!loadingConversations)
            fetchMoreConversations()
    }
    return (
        <div className="bg-card-bg rounded-[8px] p-4">
            <div className="flex justify-between pb-4 items-center border-b border-b-gray">
                <h2 className="text-lg font-bold text-center text-gray-800">
                    {t("messages")}
                </h2>
                <MdFilterList size={24} className="text-secondary" />
            </div>

            <Virtuoso
                style={{ height: "calc(100vh - 256px)" }}
                className="space-y-4 thin-scrollbar max-md:border-none border-e border-gray"
                data={sortedConversationsIds}
                endReached={fetchMore}
                increaseViewportBy={200}
                itemContent={(index, conv) => {
                    const conversation = conversationsMap.get(conv.id);
                    if (!conversation) return null;

                    const sending = isSending.get(conv.id) || false;

                    return (
                        <ChatPreviewCard
                            key={conv.id}
                            partner={conversation.partner}
                            lastMessage={conversation.lastMessage}
                            selected={conversation.id === currentOpenConversationId}
                            isSending={sending}
                            unreadCount={conversation.myUnreadCount}
                            onClick={() => handleSelectChat(conversation.id)}
                        />
                    );
                }}
                components={{
                    Footer: () =>
                        loadingConversations && sortedConversationsIds.length > 0 ? (
                            <div className="py-4 text-center text-xs text-gray-400">
                                {t("loadingMore")}
                            </div>
                        ) : null,
                }}
            />

            {/* 1️⃣ Initial loading: no conversations yet */}
            {loadingConversations && sortedConversationsIds.length === 0 && (
                Array.from({ length: 5 }).map((_, i) => <ChatPreviewSkeleton key={i} />)
            )}

            {/* 3️⃣ Empty state: no conversations loaded */}
            {!loadingConversations && sortedConversationsIds.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-10 px-2">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                        <MdFilterList size={40} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">{t("noConversationsYet")}</p>
                    <p className="text-sm text-gray-400">{t("startMessagingToSeeChats")}</p>
                </div>
            )}
        </div>
    );
});

export default ChatSidebar;

export function ChatPreviewSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4 border-b border-b-gray animate-pulse">
            {/* Avatar Skeleton */}
            <div className="shrink-0 w-14 h-14 bg-gray-200 rounded-full" />

            {/* Text Skeletons */}
            <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
        </div>
    );
}
