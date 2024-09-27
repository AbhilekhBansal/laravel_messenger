import { isAudio, isImage, isPDF, isPreviewable, isVideo } from "@/helpers";
import {
    ArrowDownTrayIcon,
    PaperClipIcon,
    PlayCircleIcon,
} from "@heroicons/react/24/solid";

const MessageAttachments = ({ attachments, attachmentClick }) => {
    return (
        <>
            {attachments.length > 0 && (
                <div className="mt-2 flex-wrap flex justify-end gap-1">
                    {attachments.map((attachment, ind) => (
                        <div
                            className={
                                `group flex flex-col items-center justify-center text-gray-500 relative cursor-pointer ` +
                                (isAudio(attachment)
                                    ? "w-84"
                                    : "w-32 aspect-square bg-blue-100")
                            }
                            key={attachment.id}
                            onClick={(ev) => attachmentClick(attachments, ind)}
                        >
                            {!isAudio(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="z-20 opacity-100 group-hover:opacity-100 transition-all w-6 h-6 flex items-center justify-center text-gray-100 dark:text-gray-800 bg-gray-700 rounded absolute right-0 top-0 cursor-pointer hover:bg-gray-800"
                                >
                                    <ArrowDownTrayIcon className="text-gray-200 p-1" />
                                </a>
                            )}
                            {isImage(attachment) && (
                                <img
                                    className="object-contain aspect-square"
                                    src={attachment.url}
                                />
                            )}
                            {isVideo(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <PlayCircleIcon className="z-20 absolute w-16 h-16 text-white dark:text-black opacity-70" />
                                    <div className="absolute left-0 top-0 w-full h-full bg-black/50 z-10"></div>
                                    <video src={attachment.url}></video>
                                </div>
                            )}
                            {isAudio(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <audio
                                        src={attachment.url}
                                        controls
                                    ></audio>
                                </div>
                            )}
                            {isPDF(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <div className="absolute top-0 bottom-0 left-0 right-0"></div>
                                    <iframe
                                        className=" w-full h-full"
                                        src={attachment.url}
                                    ></iframe>
                                </div>
                            )}
                            {!isPreviewable(attachment) && (
                                <a
                                    className="flex flex-col justify-center items-center"
                                    src={attachment.url}
                                    download
                                    onClick={(ev) => ev.stopPropagation()}
                                >
                                    <PaperClipIcon className="w-10 h-10 mb-3" />
                                    <small className="text-center">
                                        {attachment.name}
                                    </small>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};
export default MessageAttachments;
