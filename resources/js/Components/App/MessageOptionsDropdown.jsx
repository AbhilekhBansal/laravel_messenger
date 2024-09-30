import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import {
    EllipsisVerticalIcon,
    LockClosedIcon,
    LockOpenIcon,
    ShieldCheckIcon,
    TrashIcon,
    UserIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { useEventBus } from "@/EventBus";

export default function MessageOptionsDropdown({ message }) {
    const { emit } = useEventBus();

    const onMessageDelete = () => {
        // TODO: Delete message from conversation
        axios
            .post(route("message.destroy", message.id))
            .then((response) => {
                emit("message.deleted", {
                    message,
                    prevMessage: response.data.message,
                });
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    return (
        <>
            <Menu
                as="div"
                className="relative inline-block text-left right-3 -top-1"
            >
                <div>
                    <MenuButton className="flex justify-center items-center w-6 h-6 rounded-full dark:hover:bg-black/40 hover:bg-white/40">
                        <EllipsisVerticalIcon className="w-4 h-4" />
                    </MenuButton>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <MenuItems
                        className="absolute -right-3 mt-2 ml-2 w-36 rounded-md dark:bg-slate-700 bg-gray-300 shadow-lg z-50 
                    "
                    >
                        <div className="px-1 py-1">
                            <MenuItem>
                                {({ active }) => (
                                    <button
                                        onClick={onMessageDelete}
                                        className={`items-center hover:bg-slate-800 dark:text-white text-black group flex w-full rounded-md px-2 py-2 text-sm`}
                                    >
                                        <TrashIcon className="w-4" />
                                        <span className=""> Delete</span>
                                    </button>
                                )}
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Transition>
            </Menu>
        </>
    );
}
