import { Message } from "@/types/dashboard/chat";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BsSendFill } from "react-icons/bs";


type ConversationThreadProps = {
    messages: Message[];
    participant: {
        name: string;
        imageSrc: string;
    };
    onSendMessage?: (message: string) => void;
    className?: string
};

export default function ConversationThread({
    messages,
    participant,
    onSendMessage,
    className
}: ConversationThreadProps) {
    const [message, setMessgae] = useState<string>('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('dashboard.chats');

    // Scroll to bottom when messages change
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "instant" });
        }
    }, [messages]);
    function handleSendMessage(value: string) {
        if (!value) return;
        setMessgae('')
        onSendMessage?.(value)

    }

    return (
        <div className={`relative ${className}`}>
            {/* Scrollable Message Area */}
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="shrink-0 w-14 h-14 relative rounded-full overflow-hidden">
                    <Image
                        src={participant.imageSrc}
                        alt={`${participant.name}'s profile`}
                        width={56}
                        height={56}
                        className="object-cover"
                    />
                </div>
                <h4 className="text-base font-semibold text-dark">{participant.name}</h4>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-162px)] md:h-[calc(100vh-310px)] thin-scrollbar space-y-6 pr-1 ">
                {/* Messages */}
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 font-medium text-base">
                        {t('noMessages')}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {messages?.map((msg, index) => (
                            <div key={index}>
                                <p className="text-input text-center font-bold">
                                    {new Date(msg.timestamp).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                                <div className="flex items-center gap-4 p-4 rounded-lg transition">
                                    <div className="shrink-0 w-[37px] h-[37px] relative rounded-full overflow-hidden">
                                        <Image
                                            src={
                                                msg.role === "host"
                                                    ? "/users/user-4.jpg"
                                                    : participant.imageSrc
                                            }
                                            alt={`${msg.sender}'s profile`}
                                            width={37}
                                            height={37}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="flex items-center gap-4 mt-1">
                                            <h4 className="text-xl font-bold text-dark">{msg.sender}</h4>
                                            <div className="text-input">
                                                {new Date(msg.timestamp).toLocaleTimeString("en-US", {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}
                                            </div>
                                        </div>
                                        <p className="text-base text-dark font-medium break-all">{msg.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>)}
            </div>

            {/* Input */}
            <div className="flex items-end mt-auto absolute bottom-8 start-4 end-4 md:bottom-0 md:start-0 md:end-0 bg-white">
                <div className="flex items-center gap-5 flex-1">
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={message}
                        onChange={(e) => setMessgae(e.target.value)}
                        className="p-3 border border-gray rounded-full focus:outline-0 w-full"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSendMessage(message);
                            }
                        }}
                    />
                    <button onClick={() => handleSendMessage(message)}>
                        <BsSendFill size={26} className="shrink-0 text-primary" />
                    </button>
                </div>
            </div>
        </div>
    );

}
