import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import TextInput from "@/Components/TextInput";
import ConversationItem from "@/Components/App/ConversationItem";
import { useTheme } from "@/ThemeContext";
import { useEventBus } from "@/EventBus";
import GroupModal from "@/Components/App/GroupModal";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const { on } = useEventBus();
    const { onlineUsers, setOnlineUsers, setTheme } = useTheme();
    const isUserOnline = (userId) => onlineUsers[userId];

    const onSearch = (ev) => {
        const search = ev.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return conversation.name.toLowerCase().includes(search);
            })
        );
    };

    const messageCreated = (message) => {
        setLocalConversations((oldUsers) => {
            return oldUsers.map((u) => {
                // if the message is from a user
                if (
                    message.receiver_id &&
                    !u.is_group &&
                    (u.id === message.sender_id || u.id === message.receiver_id)
                ) {
                    u.last_message = message.message;
                    u.last_message_date = new Date(message.created_at);
                    return u;
                }
                // if the message is from a group
                if (
                    message.group_id &&
                    u.is_group &&
                    u.id == message.group_id
                ) {
                    u.last_message = message.message;
                    u.last_message_date = new Date(message.created_at);
                    return u;
                }
                return u;
            });
        });
    };

    const messageDeleted = ({ prevMessage }) => {
        if (!prevMessage) {
            return;
        }
        //find the conversation by prevmessage and remove it
        messageCreated(prevMessage);
    };

    useEffect(() => {
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        const offModalShow = on("GroupModal.show", (group) => {
            setShowGroupModal(true);
        });

        const offGroupDelete = on("group.deleted", ({ id, name }) => {
            setLocalConversations((oldConversations) => {
                return oldConversations.filter((c) => c.id !== id);
            });
        });
        return () => {
            offCreated();
            offDeleted();
            offModalShow();
            offGroupDelete();
        };
    }, [on]);

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }
                if (a.last_message_at && b.last_message_at) {
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                } else if (a.last_message_date) {
                    return -1;
                } else if (b.last_message_date) {
                    return 1;
                } else {
                    return 0;
                }
            })
        );
    }, [localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    // console.log(conversations);

    useEffect(() => {
        window.Echo.join("online")
            .here((users) => {
                const onlineUsersObj = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );

                setOnlineUsers((prevOnlineUsers) => {
                    return { ...prevOnlineUsers, ...onlineUsersObj };
                });
            })
            .joining((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    updatedUsers[user.id] = user;
                    return updatedUsers;
                });
            })
            .leaving((user) => {
                setOnlineUsers((prevOnlineUsers) => {
                    const updatedUsers = { ...prevOnlineUsers };
                    delete updatedUsers[user.id];
                    return updatedUsers;
                });
            })
            .error((error) => {
                console.log("error", error);
            });

        return () => {
            window.Echo.leave("online");
        };
    }, []);
    console.log(conversations);
    return (
        <>
            {/* bg-slate-800 */}
            <div
                className={`transition-all w-full sm:w-[220px] md:w-[300px] dark:bg-slate-800 bg-slate-200 flex flex-col overflow-auto ${
                    selectedConversation ? "-ml-[100%] sm:ml-0" : ""
                }`}
            >
                {/* text-gray-200 */}
                <div className="flex items-center dark:text-gray-200 text-gray-800 justify-between py-2 px-2 text-xl font-medium ">
                    <div className=" ml-4 user-name">
                        {page.props.auth.user.name}
                    </div>
                    <div
                        className="tooltip tooltip-left"
                        data-tip="Create new Group"
                    >
                        {/* text-gray-400 hover:text-gray-200*/}
                        <button
                            onClick={(ev) => setShowGroupModal(true)}
                            className="dark:text-gray-400 text-gray-600 dark:hover:text-gray-200 hover:text-gray-900"
                        >
                            <PencilSquareIcon className="w-4 h-4 inline-block ml-2" />
                        </button>
                    </div>
                </div>
                <div className="p-3">
                    <TextInput
                        onKeyUp={onSearch}
                        placeholder="Filter Users and Groups"
                        className="w-full"
                    />
                </div>
                <div className="h-lvh overflow-auto">
                    {sortedConversations &&
                        sortedConversations.map((conversation) => (
                            <ConversationItem
                                key={`${
                                    conversation.is_group ? "group" : "user"
                                }${conversation.id}`}
                                conversation={conversation}
                                online={!!isUserOnline(conversation.id)}
                            />
                        ))}
                </div>
            </div>
            {/* text-white */}
            <div className="flex-1 flex flex-col overflow-hidden dark:text-white text-black dark:bg-slate-800 border-l-2 dark:border-slate-950 border-slate-400">
                {children}
            </div>
            <GroupModal
                show={showGroupModal}
                onClose={() => setShowGroupModal(false)}
            />
        </>
    );
};
export default ChatLayout;
