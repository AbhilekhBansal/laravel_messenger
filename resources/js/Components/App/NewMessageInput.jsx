import { useEffect, useRef } from "react";

const NewMessageInput = ({ value, onChange, onSend }) => {
    const input = useRef(null);

    const onInputKeyDown = (ev) => {
        if (ev.key === "Enter" && !key.shiftKey) {
            ev.preventDefault();
            onSend(input.current.value);
        }
    };
    const onChangeEvent = (ev) => {
        setTimeout(() => {
            adjustHeight();
        }, 10);
        onChange(ev);
    };
    const adjustHeight = () => {
        setTimeout(() => {
            const inputElement = input.current;
            inputElement.style.height = "auto";
            inputElement.style.height = `${inputElement.scrollHeight + 1}px`;
        });
    };
    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <textarea
            ref={input}
            value={value}
            rows="1"
            placeholder="Type a message"
            onKeyDown={onInputKeyDown}
            onChange={(ev) => onChangeEvent(ev)}
            className="input input-bordered border-slate-900 w-full rounded-r-none overflow-y-auto max-h-40 dark:bg-gray-700 bg-gray-200"
        ></textarea>
    );
};

export default NewMessageInput;
