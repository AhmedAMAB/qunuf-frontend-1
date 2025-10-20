
import { Message, User } from "@/types/dashboard/chat";
import ConversationThread from "./ConversationThread";
import EmptyChatState from "./EmptyChatState";

interface DesktopChatPanelProps {
    selectedUser?: User;
    selectedChatId?: number;
    messagesMap: Record<number, Message[]>;
    handleSendMessage: (content: string) => void;
}

export default function DesktopChatPanel({
    selectedUser,
    selectedChatId,
    messagesMap,
    handleSendMessage,
}: DesktopChatPanelProps) {
    return (
        <div className="hidden md:block md:col-span-6 lg:col-span-7 xl:col-span-8 bg-white  rounded-[8px] relative">
            {selectedUser ? (
                <ConversationThread
                    className="h-full overflow-hidden px-4 py-6"
                    messages={messagesMap[selectedChatId!] || []}
                    participant={{
                        name: selectedUser.name,
                        imageSrc: selectedUser.imageSrc,
                    }}
                    onSendMessage={handleSendMessage}
                />
            ) : (
                <EmptyChatState />
            )}
        </div>
    );
}
