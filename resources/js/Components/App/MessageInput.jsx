import {
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    PhotoIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import NewMessageInput from "./NewMessageInput";
import axios from "axios";

const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setmessageSending] = useState(false);
    const [chosenFiles, setChosenFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onFileChange = (ev) => {
        const files = ev.target.files;

        const updatedFiles = [...files].map((file) => {
            return {
                file: file,
                url: URL.createObjectURL(file),
            };
        });

        setChosenFiles((prevFiles) => {
            return [...prevFiles, ...updatedFiles];
        });
    };
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
        chosenFiles.forEach((file) => {
            formData.append("attachments[]", file.file);
        });
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
                    console.log(progress);
                    setUploadProgress(progress);
                },
            })
            .then((response) => {
                // console.log("responsse", response);
                setNewMessage("");
                setmessageSending(false);
                setChosenFiles([]);
                setUploadProgress(0);
            })
            .catch((error) => {
                console.log("error", error);
                setmessageSending(false);
                setChosenFiles([]);
                const message =
                    error.response?.data?.message || "Failed to send message.";
                setInputErrorMessage(message);
            });
    };

    return (
        <div className="flex flex-wrap items-start border-t border-slate-700 py-3">
            <div className="order-2 flex-1 xs:flex-none xs:order-1 p-2">
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PaperClipIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        onChange={onFileChange}
                        className="absolute left-0 top-0 bottom-0 right-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300 relative">
                    <PhotoIcon className="w-6" />
                    <input
                        type="file"
                        multiple
                        onChange={onFileChange}
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
                {!!uploadProgress && (
                    <progress
                        className="progress progress-info w-full"
                        value={uploadProgress}
                        max={100}
                    ></progress>
                )}
                {inputErrorMessage && (
                    <p className="text-red-500 text-xs">{inputErrorMessage}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                    {chosenFiles.map((file, index) => (
                        <div
                            key={file.file.name}
                            className={
                                `relative flex justify-between cursor-pointer ` +
                                (isImage(file.file) ? " w-[240px]" : "")
                            }
                        >
                            {!isImage(file.file) && (
                                <img
                                    src={file.url}
                                    alt=""
                                    className="w-16 h-16 object-cover"
                                />
                            )}
                            {isAudio(file.file) && (
                                <CustomAudioPlayer
                                    file={file}
                                    showVloume={false}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="order-3 xs:order-3 p-2 flex">
                <button className="p-1 text-gray-400 hover:text-gray-300">
                    <FaceSmileIcon className="w-6" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-300">
                    <HandThumbUpIcon className="w-6" />
                </button>
            </div>
        </div>
    );
};

export default MessageInput;
