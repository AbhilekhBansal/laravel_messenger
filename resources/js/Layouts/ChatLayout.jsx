import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import Echo from "laravel-echo";
const ChatLayout = ({ children }) => {
    const page = usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;

    console.log("conversations", conversations);
    console.log("selectedConversation", selectedConversation);

    useEffect(() => {
        window.Echo.join("online")
            .here((users) => {
                console.log("here", users);
            })
            .joining((user) => {
                console.log(user);
            })
            .leaving((user) => {
                console.log(user);
            })
            .error((error) => {
                console.log("error", error);
            });
    }, []);

    return (
        <>
            ChatLayout
            <div>{children}</div>
        </>
    );
};
export default ChatLayout;
