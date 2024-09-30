import {
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    PaperClipIcon,
    PhotoIcon,
    XCircleIcon,
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
import AttachmentPreview from "./AttachmentPreview";
import CustomAudioPlayer from "./CustomAudioPlayer";
import { isAudio, isImage } from "@/helpers";
import AudioRecorder from "./AudioRecorder";
import { useEventBus } from "@/EventBus";

const MessageInput = ({ conversation = null }) => {
    const [newMessage, setNewMessage] = useState("");
    const [inputErrorMessage, setInputErrorMessage] = useState("");
    const [messageSending, setmessageSending] = useState(false);
    const [chosenFiles, setChosenFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { emit } = useEventBus();

    const onFileChange = (ev) => {
        const files = ev.target.files;
        const updatedFiles = [...files].map((file) => {
            return {
                file: file,
                url: window.URL.createObjectURL(file),
            };
        });
        ev.target.value = null;
        setChosenFiles((prevFiles = []) => {
            return [...prevFiles, ...updatedFiles]; // Spread the previous files and new files
        });
    };
    // console.log("files ", chosenFiles);

    const onSendClick = () => {
        emit("toast.show", { message: "Message sent successfully" });
        if (messageSending) {
            return;
        }
        if (newMessage.trim() === "" && chosenFiles.length === 0) {
            setInputErrorMessage(
                "Please provide a message or upload attachments."
            );
            setTimeout(() => {
                setInputErrorMessage("");
            }, 3000);
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
                setUploadProgress(0);
                setChosenFiles([]);
            })
            .catch((error) => {
                console.log("error", error);
                setmessageSending(false);
                const message = error?.response?.data?.message;
                setInputErrorMessage(
                    message || "An error occered while sending message"
                );
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

    const recordedAudioReady = (file, url) => {
        setChosenFiles((prevFiles) => {
            return [...prevFiles, { file, url }];
        });
    };

    // const sendRequest = (formData) => {};

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
                        accept="image/*"
                        onChange={onFileChange}
                        className="absolute left-0 top-0 bottom-0 right-0 z-20 opacity-0 cursor-pointer"
                    />
                </button>
                <AudioRecorder fileReady={recordedAudioReady} />
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
                    </button>
                </div>
                {!!uploadProgress && (
                    <progress
                        className="progress progress-info w-full"
                        value={uploadProgress}
                        max="100"
                    ></progress>
                )}
                {inputErrorMessage && (
                    <p className="text-red-500 text-xs">{inputErrorMessage}</p>
                )}
                {chosenFiles.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-2">
                        {chosenFiles?.map((file) => {
                            return (
                                <div
                                    key={file.file.name}
                                    className={
                                        `relative flex justify-between cursor-pointer ` +
                                        (!isImage(file.file)
                                            ? " w-[240px]"
                                            : "w-fit")
                                    }
                                >
                                    {isImage(file.file) && (
                                        <img
                                            src={file.url}
                                            alt={file.file.name}
                                            className="w-16 h-16 object-cover rounded-sm"
                                        />
                                    )}
                                    {isAudio(file.file) && (
                                        <CustomAudioPlayer
                                            file={file}
                                            showVolume={false}
                                        />
                                    )}
                                    {!isAudio(file.file) &&
                                        !isImage(file.file) && (
                                            <AttachmentPreview file={file} />
                                        )}
                                    <button
                                        className="absolute w-6 h-6 rounded-full bg-gray-800 -right-2 -top-2 text-slate-400 hover:text-gray-100 z-10 "
                                        onClick={() =>
                                            setChosenFiles(
                                                chosenFiles.filter(
                                                    (f) =>
                                                        f.file.name !==
                                                        file.file.name
                                                )
                                            )
                                        }
                                    >
                                        <XCircleIcon className="w-6" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
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
                            width={300}
                            height={350}
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
