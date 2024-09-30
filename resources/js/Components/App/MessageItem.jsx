import { usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import ReactMarkdown from "react-markdown";
import { formateMessageDateLong } from "@/helpers";
import MessageAttachments from "./MessageAttachments";
import MessageOptionsDropdown from "./MessageOptionsDropdown";
const MessageItem = ({ message, attachmentClick }) => {
    const currentUser = usePage().props.auth.user;
    return (
        <>
            <div
                className={
                    "chat" +
                    (message.sender_id === currentUser.id
                        ? " chat-end"
                        : " chat-start")
                }
            >
                {<UserAvatar user={message.sender} />}
                <div className="chat-header">
                    {/* {message.sender_id === currentUser.id
                        ? "You"
                        : message.sender.name}
                    <time className="text-xs opacity-50 ml-2">
                        {formateMessageDateLong(message.created_at)}
                    </time> */}
                </div>
                <div
                    className={
                        "chat-bubble relative" +
                        (message.sender_id === currentUser.id
                            ? " chat-bubble-info "
                            : "")
                    }
                >
                    {message.sender_id === currentUser.id && (
                        <MessageOptionsDropdown message={message} />
                    )}
                    <div className="chat-message">
                        <div className="chat-message-header">
                            <p className=" text-xs text-orange-500">
                                {message.sender_id === currentUser.id
                                    ? ""
                                    : message.sender.name}
                            </p>
                        </div>
                        <div className="chat-message-content text-wrap ">
                            <ReactMarkdown>{message.message}</ReactMarkdown>
                        </div>
                        <MessageAttachments
                            attachments={message.attachments}
                            attachmentClick={attachmentClick}
                        />
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
