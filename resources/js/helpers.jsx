export const formateMessageDateLong = (date) => {
    const inputDate = new Date(date);
    const now = new Date();

    // Check if the date is valid
    if (isNaN(inputDate.getTime())) {
        return "Invalid Date"; // Handle invalid date case
    }

    if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
        });
    } else if (isYesterday(inputDate)) {
        return (
            "Yesterday " +
            inputDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
            })
        );
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: "2-digit",
            month: "2-digit",
            timeZone: "UTC",
        });
    } else {
        return inputDate.toLocaleDateString();
    }
};

export const formateMessageDateShort = (date) => {
    // Attempt to parse the date using JavaScript's built-in parsing
    const inputDate = new Date(date);
    const now = new Date();

    // Check if the date is valid
    if (isNaN(inputDate.getTime())) {
        console.error("Invalid date:", date);
        return "Invalid Date"; // Return "Invalid Date" if parsing failed
    }

    if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
        });
    } else if (isYesterday(inputDate)) {
        return "Yesterday";
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
            timeZone: "UTC",
        });
    } else {
        return inputDate.toLocaleDateString([]);
    }
};

export const isToday = (date) => {
    const today = new Date();
    return (
        today.getFullYear() === date.getFullYear() &&
        today.getMonth() === date.getMonth() &&
        today.getDate() === date.getDate()
    );
};

export const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Subtract 1 day
    return (
        yesterday.getFullYear() === date.getFullYear() &&
        yesterday.getMonth() === date.getMonth() &&
        yesterday.getDate() === date.getDate()
    );
};

// export const isImage = (attachment) => {
//     let mime = attachment.mime || attachment.type;
//     mime = mime.split("/");
//     return mime[0].toLowerCase() === "image";
// };

export const isImage = (attachment) => {
    if (!attachment.mime && !attachment.type) {
        return false;
    }

    let mime = attachment.mime || attachment.type;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "image";
};

export const isVideo = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "video";
};

export const isAudio = (attachment) => {
    let mime = attachment.mime || attachment.type;
    mime = mime.split("/");
    return mime[0].toLowerCase() === "audio";
};

export const isPDF = (attachment) => {
    let mime = attachment.mime || attachment.type;
    return mime === "application/pdf";
};

export const isPreviewable = (attachment) => {
    return (
        isImage(attachment) ||
        isVideo(attachment) ||
        isAudio(attachment) ||
        isPDF(attachment)
    );
};

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024; // Size threshold
    const dm = decimals < 0 ? 0 : decimals; // Decimal places to show
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]; // Units

    let i = 0;
    let size = bytes;

    // Loop to determine the size index (KB, MB, etc.)
    while (size >= k) {
        size /= k;
        i++;
    }

    // Format the size to the specified decimal places using toFixed()
    return parseFloat(size.toFixed(dm)) + " " + sizes[i];
};
