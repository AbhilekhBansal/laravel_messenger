import { formatBytes, isPDF, isPreviewable } from "@/helpers";
import { PaperClipIcon } from "@heroicons/react/24/solid";
import React from "react";

const AttachmentPreview = ({ file }) => {
    console.log(file);
    return (
        <div className="w-full flex items-center gap1 py-2 px-3 rounded-md bg-slate-500">
            <div>
                {isPDF(file.file) && (
                    <img src="/img/pdf.png" className="w-12" />
                )}
                {!isPreviewable(file.file) && (
                    <div className="flex justify-center items-center w-10 h-10 bg-gray-700 rounded">
                        <PaperClipIcon className="w-6" />
                    </div>
                )}
            </div>

            <div className="flex flex-col text-gray-400 dark:text-gray-200 text-nowrap text-ellipsis overflow-hidden px-2 ">
                <h3 className="">{file.file.name}</h3>
                <p className="text-xs text-gray-800">
                    {formatBytes(file.file.size)}
                </p>
            </div>
        </div>
    );
};
export default AttachmentPreview;
