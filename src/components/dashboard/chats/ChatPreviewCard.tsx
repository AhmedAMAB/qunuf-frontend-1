import { Message } from "@/types/dashboard/chat";
import { User } from "@/types/dashboard/user";
import { formatLastMessageTime } from "@/utils/date";
import { resolveUrl } from "@/utils/upload";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { RiLoader2Fill } from "react-icons/ri";

interface ChatPreviewProps {
    partner: User;
    lastMessage?: Message;
    onClick?: () => void;
    selected: boolean;
    isSending?: boolean;
    unreadCount: number;
}

export default function ChatPreviewCard({
    partner,
    lastMessage,
    onClick,
    selected,
    unreadCount,
    isSending = true,
}: ChatPreviewProps) {
    const t = useTranslations('comman');

    return (
        <div
            className={`border-b border-b-gray cursor-pointer relative 
        ${selected ? 'bg-gray-100' : ''} 
        ${isSending ? 'opacity-70' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition relative">
                {/* Profile Image - Added Pulse & Background for skeleton feel */}
                <div className={`shrink-0 w-14 h-14 relative rounded-full overflow-hidden bg-gray-200 ${isSending ? 'animate-pulse' : ''}`}>
                    <Image
                        src={resolveUrl(partner?.imagePath) || '/users/default-user.png'}
                        alt={`${partner?.name}'s profile`}
                        width={56}
                        height={56}
                        className={`object-cover transition-opacity ${isSending ? 'opacity-40' : 'opacity-100'}`}
                    />
                </div>

                {/* Text Content */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h4 className="text-base font-semibold text-dark truncate">
                            {partner?.name}
                        </h4>

                        {/* Skeleton bar instead of time when sending */}
                        {isSending ? (
                            <div className="">
                                <RiLoader2Fill className="w-5 h-5 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            lastMessage && (
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {formatLastMessageTime(lastMessage?.created_at, t)}
                                </span>
                            )
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        {/* Last Message Preview */}
                        {lastMessage?.content && (
                            <p className={`text-sm flex-1 line-clamp-1 ${isSending ? 'opacity-50 italic' : unreadCount > 0 ? 'text-dark font-medium' : 'text-gray-500'}`}>
                                {isSending ? 'Sending message...' : lastMessage.content}
                            </p>
                        )}

                        {/* WhatsApp Style Unread Ball */}
                        {!isSending && unreadCount > 0 && (
                            <div className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-bold shadow-sm">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </div>
                        )}
                    </div>
                </div>


            </div>
        </div>
    );
}