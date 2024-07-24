import ChatLayout from "@/Layouts/ChatLayout";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useRef, useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageItem from "@/Components/App/MessageItem";
import MessageInput from "@/Components/App/MessageInput";

function Home({ messages = null, selectedConversation = null }) {
    // console.log(messages.data);
    const [localMessages, setlocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop =
                    messagesCtrRef.current.scrollHeight;
            }
        }, 10);
    }, [selectedConversation]);

    useEffect(() => {
        setlocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    return (
        <>
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-slate-200">
                    <div className="text-2xl md:text-4xl p-16 text-slate-200">
                        Please select conversation to see messages.
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
                </div>
            )}

            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />

                    <div
                        className="flex-1 overflow-y-auto p-5"
                        ref={messagesCtrRef}
                    >
                        {/* messages */}
                        {localMessages?.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-slate-200 ">
                                    No messages found
                                </div>
                            </div>
                        )}
                        {localMessages?.length > 0 && (
                            <div className="flex flex-col">
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    {/* <MessageInput conversation={selectedConversation} /> */}
                    <MessageInput conversation={selectedConversation} />
                </>
            )}
        </>
    );
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout user={page.props.auth.user}>
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    );
};

export default Home;
