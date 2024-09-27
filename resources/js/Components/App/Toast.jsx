import { useEventBus } from "@/EventBus";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Toast({}) {
    const [toasts, setToasts] = useState([]);
    const { on } = useEventBus();

    useEffect(() => {
        on("toast.show", ({ message }) => {
            const uuid = uuidv4();
            setToasts((prevToasts) => [...prevToasts, { id: uuid, message }]);
            setTimeout(() => {
                setToasts((prevToasts) =>
                    prevToasts.filter((t) => t.id !== uuid)
                );
            }, 3000);
        });
    }, [on]);
    return (
        <div className="toast min-w-[280px]">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    className="alert alert-success py-3 px-4 text-gray-100 rounded-md"
                >
                    <span>{toast.message}</span>
                </div>
            ))}
        </div>
    );
}
