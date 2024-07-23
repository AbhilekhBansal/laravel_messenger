export const formateMessageDateLong = (date) => {
    const now = new Date();
    const inputDate = new Date(date);

    if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } else if (isYesterday(inputDate)) {
        return (
            "Yesterday " +
            inputDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })
        );
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: "2-digit",
            month: "2-digit",
        });
    } else {
        return inputDate.toLocaleDateString();
    }
};

export const formateMessageDateShort = (date) => {
    const inputDate = new Date(date);
    const now = new Date();

    if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    } else if (isYesterday(inputDate)) {
        return "Yesterday";
    } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
        });
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
    yesterday.setDate(yesterday.getDate() - 1); // Subtract 1
    return (
        yesterday.getFullYear() === date.getFullYear() &&
        yesterday.getMonth() === date.getMonth() &&
        yesterday.getDate() === date.getDate()
    );
};
