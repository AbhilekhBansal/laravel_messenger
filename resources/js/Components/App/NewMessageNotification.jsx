import { useEventBus } from "@/EventBus";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";
export default function NewMessageNotification({}) {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();
    const currentRef = useRef(false);

    useEffect(() => {
        if (!currentRef.current) {
            on("newMessageNotification", ({ message, user, group_id }) => {
                const uuid = uuidv4();
                setToasts((prevToasts) => [
                    ...prevToasts,
                    { id: uuid, message, user, group_id },
                ]);
                currentRef.current = true;
                setTimeout(() => {
                    setToasts((prevToasts) =>
                        prevToasts.filter((t) => t.id !== uuid)
                    );
                }, 5000);
            });
        }
    }, [on]);

    return (
        <div className="toast toast-top toast-center min-w-[280px]">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    className="alert alert-success py-3 px-4 text-gray-100 rounded-md flex items-center gap-2 shadow-md"
                >
                    <Link
                        href={
                            toast.group_id
                                ? route("chat.group", toast.group_id)
                                : route("chat.user", toast.user.id)
                        }
                        className="flex gap-2 items-center w-full"
                    >
                        <UserAvatar user={toast.user} />

                        <div className="flex flex-col w-full">
                            <h3 className="font-bold text-sm text-white">
                                {toast.user.name}
                            </h3>
                            <span className="text-xs text-gray-300 break-words overflow-hidden">
                                {toast.message.substring(0, 20)}
                            </span>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
