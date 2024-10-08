import { Link, usePage } from "@inertiajs/react";
import GroupAvatar from "./GroupAvatar";
import UserAvatar from "./UserAvatar";
import UserOptionsDropdown from "./UserOptionsDropdown";
import { formateMessageDateShort } from "@/helpers";

const ConversationItem = ({
    conversation,
    selectedConversation = null,
    online = null,
}) => {
    const page = usePage();
    const currentUser = page.props.auth.user;
    let classes = "barder-transparent";
    if (selectedConversation) {
        if (
            !selectedConversation.is_group &&
            conversation.is_group &&
            selectedConversation.user_id === currentUser.id
        ) {
            classes = "border-blue-500 bg-black/20";
        }
    }
    return (
        // text-gray-300

        <Link
            href={
                conversation.is_group
                    ? route("chat.group", conversation)
                    : route("chat.user", conversation)
            }
            preserveState
            className={
                "conversation-item flex items-center gap-2 p-2 text-gray-800 dark:text-gray-300 transition-all cursor-pointer border-1-4 hover:bg-black/30 " +
                classes +
                (conversation.is_user && currentUser.is_admin ? "pr-2" : "pr-4")
            }
        >
            {conversation.is_user && (
                <UserAvatar user={conversation} online={online} />
            )}
            {conversation.is_group && <GroupAvatar />}
            <div
                className={
                    `flex-1 text-xs max-w-full overflow-hidden` +
                    (conversation.is_user && conversation.blocked_at
                        ? "opacity-50"
                        : "")
                }
            >
                <div className="flex gap-1 justify-between items-center">
                    <h3 className="text-sm font-semibold overflow-hidden text-nowrap text-ellipsis">
                        {conversation.name}
                    </h3>
                    {conversation.last_message && (
                        <span className="text-nowrap">
                            {formateMessageDateShort(
                                conversation.last_message_date
                            )}
                        </span>
                    )}
                </div>
                {conversation.last_message && (
                    <p className="text-xs text-nowrap overflow-hidden text-ellipsis">
                        {conversation.last_message}
                    </p>
                )}
            </div>
            {currentUser.is_admin === 1 && conversation.is_user && (
                <UserOptionsDropdown conversation={conversation} />
            )}
        </Link>
    );
};

export default ConversationItem;
