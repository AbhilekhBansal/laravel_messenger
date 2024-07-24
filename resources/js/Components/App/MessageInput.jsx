import { PaperClipIcon, PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setmessageSending] = useState(fasle);

    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        className="absolute left-0 top-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute left-0 top-0 bottom-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
            </div>
            <div className="order-1 px-3 flex-1 xs:p-0 min-w-[220px] basis-full xs:order-2 relative">
                <div className="flex">
                    <NewMessageInput
                        onChange={(ev) => setNewMessage(ev.target.value)}
                    />
                    <button>
                        {messageSending && (
                            <span className="loading loadin"></span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageInput;
