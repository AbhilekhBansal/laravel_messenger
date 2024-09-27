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
                }, 3000);
            });
        }
    }, [on]);

    return (
        <div className="toast toast-top toast-center min-w-[280px]">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    className="alert alert-success py-3 px-4 text-gray-100 rounded-md"
                >
                    <Link
                        href={
                            toast.group_id
                                ? route("chat.group", toast.group_id)
                                : route("chat.user", toast.user.id)
                        }
                        className="flex gap-2 items-center"
                    >
                        <UserAvatar user={toast.user} />
                        <span>{toast.message}</span>
                    </Link>
                </div>
            ))}
        </div>
    );
}
