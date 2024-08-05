import ChatLayout from "@/Layouts/ChatLayout";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageItem from "@/Components/App/MessageItem";
import MessageInput from "@/Components/App/MessageInput";
import { useEventBus } from "@/EventBus";
import { useTheme } from "@/ThemeContext";

function Home({ messages = null, selectedConversation = null }) {
    // console.log(messages.data);
    const { theme, setTheme } = useTheme();
    const { onlineUsers, setOnlineUsers } = useTheme();
    const [localMessages, setlocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const [loader, setloader] = useState(false);
    const { on } = useEventBus();
    const messagesCtrRef = useRef(null);
    const loadMoreIntersect = useRef(null);

    console.log("selected conversation !!", selectedConversation.is_user);
    const loadMoreMessages = useCallback(
        (e) => {
            console.log(messages);
            setloader(true);
            // Fetch more messages here
            // debugger; // Here you should call your API to fetch more messages
            if (noMoreMessages) {
                return;
            }
            const firstMessage = localMessages[0];
            axios
                .get(route("message.loadOlder", firstMessage.id))
                .then((response) => {
                    setloader(false);
                    if (response.data.length > 0) {
                        setNoMoreMessages(true);
                        return;
                    }

                    const scrollHeight = messagesCtrRef.current.scrollHeight;
                    const scrollTop = messagesCtrRef.current.scrollTop;
                    const clientHeight = messagesCtrRef.current.clientHeight;

                    const tmpScrollFromButton =
                        scrollHeight - scrollTop - clientHeight;
                    // console.log("tmpScrollFromButton", tmpScrollFromButton);

                    setScrollFromBottom(
                        scrollHeight - scrollTop - clientHeight
                    );

                    setlocalMessages((prevMessages) => {
                        // console.log("second", response.data.data.reverse());
                        return [...response.data.data, ...prevMessages];
                    });
                });
        },
        [localMessages, noMoreMessages]
    );

    const messageCreated = (message) => {
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setlocalMessages((prevMessages) => [
                ...prevMessages,
                message.reverse(),
            ]);
        }
        if (
            selectedConversation &&
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id ||
                selectedConversation.id == message.receiver_id)
        ) {
            setlocalMessages((prevMessages) => [...prevMessages, message]);
        }
        // console.log("msg updated");
    };

    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop =
                    messagesCtrRef.current.scrollHeight;
            }
            // console.log("scroll to bottom");
            setScrollFromBottom(0);
            setNoMoreMessages(false);
        }, 10);
        const offCreated = on("message.created", messageCreated);

        return () => {
            offCreated();
        };
    }, [selectedConversation]);

    useEffect(() => {
        // console.log(
        //     "exp message array",
        //     messages ? messages : messages.data.data.reverse()
        // );
        setlocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    useEffect(() => {
        if (messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop =
                messagesCtrRef.current.scrollHeight -
                messagesCtrRef.current.offsetHeight -
                scrollFromBottom;
            setScrollFromBottom(null);
        }

        if (noMoreMessages) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach(
                    (entry) => entry.isIntersecting && loadMoreMessages()
                ),
            {
                rootMargin: "0px 0px 250px 0px",
            }
        );
        if (loadMoreIntersect.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersect.current);
            }, 100);
        }

        return () => {
            observer.disconnect();
        };
    }, [localMessages]);

    return (
        <>
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center dark:text-slate-200 text-slate-800">
                    <div className="text-2xl md:text-4xl p-16 dark:text-slate-200 text-slate-800">
                        Please select conversation to see messages.
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
                </div>
            )}

            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                        onlineUsers={onlineUsers}
                    />
                    {loader && (
                        <div className="m-auto justify-center mt-7">
                            <span
                                className={`loading loading-infinity loading-md ${
                                    theme
                                        ? "text-indigo-600"
                                        : "text-indigo-300"
                                }`}
                            ></span>
                        </div>
                    )}

                    <div
                        className="flex-1 overflow-y-auto p-5"
                        ref={messagesCtrRef}
                    >
                        {/* messages */}
                        {localMessages?.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg dark:text-slate-200 text-slate-800">
                                    No messages found
                                </div>
                            </div>
                        )}
                        {localMessages?.length > 0 && (
                            <div className="flex flex-col">
                                <div ref={loadMoreIntersect}></div>
                                {localMessages.map((message, index) => (
                                    <MessageItem
                                        key={index}
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
