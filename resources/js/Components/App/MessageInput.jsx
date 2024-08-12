import {
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    PhotoIcon,
} from "@heroicons/react/24/solid";
import { useState, Fragment } from "react";
import NewMessageInput from "./NewMessageInput";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import {
    Popover,
    PopoverButton,
    PopoverPanel,
    Transition,
} from "@headlessui/react";

const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setmessageSending] = useState(false);
    const onSendClick = () => {
        if (messageSending) {
            return;
        }
        if (newMessage.trim() === "") {
            setInputErrorMessage(
                "Please provide a message or upload attachments."
            );
            setTimeout(() => {
                setInputErrorMessage("");
            }, 3050);
            return;
        }
        const formData = new FormData();
        formData.append("message", newMessage);
        if (conversation.is_user) {
            formData.append("receiver_id", conversation.id);
        } else if (conversation.is_group) {
            formData.append("group_id", conversation.id);
        }
        setmessageSending(true);
        axios
            .post(route("message.store"), formData, {
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    // console.log(progress);
                },
            })
            .then((response) => {
                // console.log("responsse", response);
                setNewMessage("");
                setmessageSending(false);
            })
            .catch((error) => {
                console.log("error", error);
                setmessageSending(false);
            });
    };

    const onLikeClick = () => {
        if (messageSending) {
            return;
        }
        const data = { message: "👍" };
        if (conversation.is_user) {
            data["receiver_id"] = conversation.id;
        } else if (conversation.is_group) {
            data["group_id"] = conversation.id;
        }

        axios.post(route("message.store"), data);
    };

    const sendRequest = (formData) => {};

    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        className="absolute left-0 top-0 bottom-0 right-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute left-0 top-0 bottom-0 right-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
            </div>
            <div className="order-1 px-3 flex-1 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 relative">
                <div className="flex text-slate-200">
                    <NewMessageInput
                        value={newMessage}
                        onChange={(ev) => setNewMessage(ev.target.value)}
                        onSend={onSendClick}
                    />
                    <button
                        onClick={onSendClick}
                        // disabled={messageSending}
                        className="btn btn-info rounded-l-none"
                    >
                        {messageSending ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                            <PaperAirplaneIcon className="w-6" />
                        )}
                        {/* <span className="hidden sm:inline">Send</span> */}
                    </button>
                </div>
                {inputErrorMessage && (
                    <p className="text-red-500 text-xs">{inputErrorMessage}</p>
                )}
            </div>

            <div className="order-3 xs:order-3 p-2 flex">
                <Popover className="relative">
                    <PopoverButton className="p-1 text-gray-400 hover:text-gray-300">
                        <FaceSmileIcon className="w-6" />
                    </PopoverButton>
                    <PopoverPanel
                        anchor="bottom end"
                        className="flex flex-col [--anchor-gap:30px] sm:[--anchor-gap:60px]"
                    >
                        <EmojiPicker
                            theme="dark"
                            onEmojiClick={(ev) =>
                                setNewMessage(newMessage + ev.emoji)
                            }
                        ></EmojiPicker>
                    </PopoverPanel>
                </Popover>
                {/* <button className="p-1 text-gray-400 hover:text-gray-300">
                    <FaceSmileIcon className="w-6" />
                </button> */}
                <button
                    onClick={onLikeClick}
                    className="p-1 text-gray-400 hover:text-gray-300"
                >
                    <HandThumbUpIcon className="w-6" />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
