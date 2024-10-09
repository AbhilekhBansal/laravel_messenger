import { useEventBus } from "@/EventBus";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
export default function TopNotification({}) {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();
    const currentRef = useRef(false);

    useEffect(() => {
        if (!currentRef.current) {
            on("TopNotification", ({ message }) => {
                const uuid = uuidv4();
                setToasts((prevToasts) => [
                    ...prevToasts,
                    { id: uuid, message },
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
        <div className="toast toast-top toast-center min-w-[40%]">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    className="alert alert-warning py-3 px-4 text-gray-100 rounded-md flex items-center gap-2 shadow-md"
                >
                    <div className="flex flex-col w-full">
                        <span className="text-xs text-wrap text-white break-words overflow-hidden">
                            {toast.message}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
