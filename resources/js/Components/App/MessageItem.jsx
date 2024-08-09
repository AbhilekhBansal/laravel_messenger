import { usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import ReactMarkdown from "react-markdown";
import { formateMessageDateLong } from "@/helpers";
const MessageItem = ({ message }) => {
    const currentUser = usePage().props.auth.user;
    return (
        <>
            <div
                className={
                    "chat mt-1 mb-1" +
                    (message.sender_id === currentUser.id
                        ? " chat-end"
                        : " chat-start")
                }
            >
                {<UserAvatar user={message.sender} />}
                {/* <div className="chat-header">
                    {message.sender_id === currentUser.id
                        ? "You"
                        : message.sender.name}
                    <time className="text-xs opacity-50 ml-2">
                        {formateMessageDateLong(message.created_at)}
                    </time>
                </div> */}
                <div
                    className={
                        "chat-bubble relative chat-bubble-info " +
                        (message.sender_id === currentUser.id ? " self" : "")
                    }
                >
                    <div className="chat-message">
                        <div className="chat-message-header">
                            <p className=" text-xs text-orange-500">
                                {message.sender_id === currentUser.id
                                    ? ""
                                    : message.sender.name}
                            </p>
                        </div>
                        <div className="chat-message-content text-wrap">
                            <ReactMarkdown>{message.message}</ReactMarkdown>
                        </div>
                        <div
                            className={`chat-message-footer float-right ${
                                message.sender_id !== currentUser.id
                                    ? "float-right text-slate-400"
                                    : "float-right text-black"
                            }`}
                        >
                            <time className="text-xs opacity-50">
                                {formateMessageDateLong(message.created_at)}
                            </time>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessageItem;
