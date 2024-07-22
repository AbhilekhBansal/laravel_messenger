import ChatLayout from "@/Layouts/ChatLayout";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

function Home({ messages }) {
    const [localMessages, setlocalMessages] = useState([]);

    useEffect(() => {}, [messages]);

    return (
        <>
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-slate-200">
                    <div className="text-2xl md:text-4xl p-16 text-slate-200">
                        Please select comversation to see messages.
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
                        ref={{ messageCtrRef }}
                    >
                        {localMessages.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-slate-200 ">
                                    No messages found
                                </div>
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className="flex flex-1 flex-col">
                                {localMessages.map((message, index) => (
                                    <MessageItem
                                        key={index}
                                        message={message}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
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
