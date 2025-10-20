'use client'

import { useState } from "react";
import ChatInterface from "../chats/ChatInterface";
import { Message } from "@/types/dashboard/chat";


const messagesByUserId: Record<number, Message[]> = {
    1: [
        {
            sender: "Ahmed Ali",
            role: "guest",
            timestamp: "Oct 17, 2025, 6:45 PM",
            content:
                "Hi Bassem! We are looking at your home for a family vacation. Curious about the bedroom situation... it is listed as 4 bedrooms but there appears to be 5 in the photos. Thank you!",
        },
        {
            sender: "Bassem",
            role: "host",
            timestamp: "Oct 17, 2025, 7:00 PM",
            content:
                "Hi Ahmed – there are 4 bedrooms and another room used as an office. It has a deluxe queen mattress available for sleeping.",
        },
        {
            sender: "Ahmed Ali",
            role: "guest",
            timestamp: "Oct 17, 2025, 7:15 PM",
            content:
                "Perfect, that helps a lot. We’ll finalize the booking soon. Appreciate the quick reply!",
        },
        {
            sender: "Bassem",
            role: "host",
            timestamp: "Oct 17, 2025, 7:18 PM",
            content:
                "You're welcome! Let me know if you need anything else before confirming.",
        },
    ],
    2: [
        {
            sender: "Fatima Youssef",
            role: "guest",
            timestamp: "Oct 16, 2025, 3:15 PM",
            content: "Thanks for the update. We'll confirm dates soon.",
        },
        {
            sender: "Bassem",
            role: "host",
            timestamp: "Oct 16, 2025, 3:20 PM",
            content: "Sounds good, Fatima. Let me know if you need help with anything.",
        },
        {
            sender: "Fatima Youssef",
            role: "guest",
            timestamp: "Oct 16, 2025, 3:25 PM",
            content: "Will do! Appreciate your support.",
        },
    ],
    3: [
        {
            sender: "Omar Khaled",
            role: "guest",
            timestamp: "Oct 15, 2025, 9:30 AM",
            content: "Can you clarify the parking availability?",
        },
        {
            sender: "Bassem",
            role: "host",
            timestamp: "Oct 15, 2025, 9:45 AM",
            content: "Sure—there’s one reserved spot in front of the building and additional street parking nearby.",
        },
    ],
};

const users = [
    {
        id: 1,
        imageSrc: "/users/user-1.jpg",
        name: "Ahmed Ali",
        lastMessage:
            "Also, these messages pop up on my traveling page, not my hosting page. It’s a bit confusing when trying to manage inquiries. Could we have them appear on the hosting page instead, so I can respond more efficiently and keep everything organized?",
    },
    {
        id: 2,
        imageSrc: "/users/user-2.jpg",
        name: "Fatima Youssef",
        lastMessage: "Thanks for the update...",
    },
    {
        id: 3,
        imageSrc: "/users/user-5.jpg",
        name: "Omar Khaled",
        lastMessage: "Can you clarify parking...",
    },
    {
        id: 4,
        imageSrc: "/users/user-1.jpg",
        name: "Ahmed Ali",
        lastMessage:
            "Also, these messages pop up on my traveling page, not my hosting page. It’s a bit confusing when trying to manage inquiries. Could we have them appear on the hosting page instead, so I can respond more efficiently and keep everything organized?",
    },
    {
        id: 5,
        imageSrc: "/users/user-2.jpg",
        name: "Fatima Youssef",
        lastMessage: "Thanks for the update...",
    },
    {
        id: 6,
        imageSrc: "/users/user-5.jpg",
        name: "Omar Khaled",
        lastMessage: "Can you clarify parking...",
    },
    {
        id: 7,
        imageSrc: "/users/user-1.jpg",
        name: "Ahmed Ali",
        lastMessage:
            "Also, these messages pop up on my traveling page, not my hosting page. It’s a bit confusing when trying to manage inquiries. Could we have them appear on the hosting page instead, so I can respond more efficiently and keep everything organized?",
    },
    {
        id: 8,
        imageSrc: "/users/user-2.jpg",
        name: "Fatima Youssef",
        lastMessage: "Thanks for the update...",
    },
    {
        id: 9,
        imageSrc: "/users/user-5.jpg",
        name: "Omar Khaled",
        lastMessage: "Can you clarify parking...",
    },
];


export default function Chats() {
    const [messagesMap, setMessagesMap] = useState<Record<number, Message[]>>(messagesByUserId);

    return <ChatInterface
        users={users}
        messagesMap={messagesMap}
        onUpdateMessages={(chatId, newMessages) =>
            setMessagesMap((prev) => ({ ...prev, [chatId]: newMessages }))
        }
    />

}