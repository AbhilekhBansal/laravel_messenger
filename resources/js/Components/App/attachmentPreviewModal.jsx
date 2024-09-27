import { isAudio, isImage, isPDF, isPreviewable, isVideo } from "@/helpers";
import {
    Button,
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PaperClipIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState, Fragment } from "react";

export default function AttachmentPreviewModal({
    attachments,
    index,
    show = false,
    onClose = () => {},
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const attachment = useMemo(() => {
        return attachments[currentIndex];
    }, [attachments, currentIndex]);
    const previewableAttachments = useMemo(() => {
        return attachments.filter((attachment) => isPreviewable(attachment));
    }, [attachments]);

    const close = () => {
        onClose();
        console.log("close modal");
    };
    const prev = () => {
        if (currentIndex === 0) {
            return;
        }
        setCurrentIndex(currentIndex - 1);
    };
    const next = () => {
        if (currentIndex === previewableAttachments.length - 1) {
            return;
        }
        setCurrentIndex(currentIndex + 1);
    };
    useEffect(() => {
        setCurrentIndex(index);
    }, [index]);

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                className="relative z-50"
                as="div"
                id="model"
                onClose={close}
            >
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 dark:bg-gray-300" />
                </TransitionChild>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="h-screen w-screen">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <DialogPanel className="flex flex-col w-full h-full tranfrom overflow-hidden bg-slate-800 dark:bg-slate-300 text-left align-middle shadow-lg transition-all">
                                <Button
                                    onClick={close}
                                    className="absolute right-3 top-3 h-10 w-10 rounded-full hover:bg-black/50 
                                    bg-black/10 transition flex justify-center items-center text-gray-100 z-40"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </Button>
                                <div className="relative group h-full ">
                                    {currentIndex > 0 && (
                                        <div
                                            onClick={prev}
                                            className="
                                    absolute opacity-100 text-gray-100 cursor-pointer flex items-center justify-center left-4 h-12 w-12 top-1/2 -translate-y-1/2 rounded-full z-30 bg-black/50"
                                        >
                                            <ChevronLeftIcon className="w-8 p-1" />
                                        </div>
                                    )}
                                    {currentIndex <
                                        previewableAttachments.length - 1 && (
                                        <div
                                            onClick={next}
                                            className="
                                    absolute opacity-100 text-gray-100 cursor-pointer flex items-center justify-center right-4 h-12 w-12 top-1/2 -translate-y-1/2 rounded-full z-30 bg-black/50"
                                        >
                                            <ChevronRightIcon className="w-8 p-1" />
                                        </div>
                                    )}
                                    {attachment && (
                                        <div className="flex items-center justify-center h-full w-full p-3">
                                            {isImage(attachment) && (
                                                <img
                                                    src={attachment.url}
                                                    className="max-h-full max-w-full"
                                                />
                                            )}
                                            {isVideo(attachment) && (
                                                <div className="flex items-center">
                                                    <video
                                                        src={attachment.url}
                                                        controls
                                                        autoPlay
                                                    ></video>
                                                </div>
                                            )}
                                            {isAudio(attachment) && (
                                                <div className="relative flex items-center justify-center">
                                                    <audio
                                                        src={attachment.url}
                                                        controls
                                                        autoPlay
                                                    ></audio>
                                                </div>
                                            )}
                                            {isPDF(attachment) && (
                                                <iframe
                                                    src={attachment.url}
                                                    className="h-full w-full"
                                                ></iframe>
                                            )}
                                            {!isPreviewable(attachment) && (
                                                <div className="flex p-32 flex-col justify-center items-center text-gray-100">
                                                    <PaperClipIcon className="mb-3 w-10 h-10" />
                                                    <small className="justify-center">
                                                        {attachment.name}
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
