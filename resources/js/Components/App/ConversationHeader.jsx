import {
    ArrowLeftIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import axios from "axios";
import GroupUserPopover from "./GroupUserPopover";
import GroupDescriptionPopover from "./GroupDescriptionPopover";
import { useEventBus } from "@/EventBus";

const ConversationHeader = ({ selectedConversation, onlineUsers }) => {
    const authUser = usePage().props.auth.user;
    const { emit } = useEventBus();
    const onDeleteGroup = () => {
        if (!window.confirm("Are you sure you want to delete this Group?")) {
            return;
        }

        axios
            .delete(route("group.destroy", selectedConversation.id))
            .then((response) => {
                console.log("response", response.data);
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const isUserOnline = (userId) => onlineUsers[userId];

    return (
        <>
            {selectedConversation && (
                <div className="p-3 flex justify-between items-center border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("dashboard")}
                            className="inline-block sm:hidden"
                        >
                            <ArrowLeftIcon className="w-6" />
                        </Link>
                        {selectedConversation.is_user && (
                            <UserAvatar
                                user={selectedConversation}
                                online={!!isUserOnline(selectedConversation.id)}
                            />
                        )}
                        {selectedConversation.is_group && <GroupAvatar />}
                        <div>
                            <h3>{selectedConversation.name}</h3>
                            {selectedConversation.is_group && (
                                <p className="text-xs text-gray-500">
                                    {selectedConversation.users.length} members
                                </p>
                            )}
                        </div>
                    </div>
                    {selectedConversation.is_group && (
                        <div className="flex gap-3">
                            <GroupDescriptionPopover
                                description={selectedConversation.description}
                            />
                            <GroupUserPopover
                                users={selectedConversation.users}
                            />
                            {selectedConversation.owner_id == authUser.id && (
                                <>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Edit Group"
                                    >
                                        <button
                                            className="text-gray-400 hover:text-gray-200"
                                            onClick={(ev) => {
                                                emit(
                                                    "GroupModal.show",
                                                    selectedConversation
                                                );
                                            }}
                                        >
                                            <PencilSquareIcon className="w-4 " />
                                        </button>
                                    </div>
                                    <div
                                        className="tooltip tooltip-left"
                                        data-tip="Delete Group"
                                    >
                                        <button
                                            className="text-gray-400 hover:text-gray-200"
                                            onClick={onDeleteGroup}
                                        >
                                            <TrashIcon className="w-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ConversationHeader;
