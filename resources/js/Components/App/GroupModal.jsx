import { useEventBus } from "@/EventBus";
import { useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import SecondaryButton from "../SecondaryButton";
import TextInput from "../TextInput";
import InputError from "../InputError";
import TextAreaInput from "../TextAreaInput";
import UserPicker from "./UserPicker";
import InputLabel from "../InputLabel";
import PrimaryButton from "../PrimaryButton";

export default function GroupModal({ show = false, onClose = () => {} }) {
    const page = usePage();
    const conversations = page.props.conversations;
    const { on, emit } = useEventBus();
    const [group, setGroup] = useState({});
    const { data, setData, processing, reset, post, put, errors } = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: [],
    });

    const users = conversations.filter((c) => !c.is_group);
    const createOrUpdateGroup = (e) => {
        e.preventDefault();
        if (group.id) {
            put(route("group.update", group.id), {
                onSuccess: () => {
                    closeModal();
                    emit(
                        "toast.show",
                        `Group ${data.name} was updated successfully`
                    );
                },
            });
            return;
        }
        post(route("group.store"), {
            onSuccess: () => {
                emit(
                    "toast.show",
                    `Group ${data.name} was created successfully`
                );
                closeModal();
            },
        });
    };

    const closeModal = () => {
        onClose();
        reset();
    };

    useEffect(() => {
        return on("GroupModal.show", (group) => {
            setData({
                name: group.name || "",
                description: group.description || "",
                user_ids: group.users
                    // .filter((u) => u.id !== group.owner_id)
                    .map((u) => u.id),
            });
            setGroup(group);
            console.log(data);
        });
    }, [on]);

    return (
        <>
            <Modal show={show} onClose={closeModal}>
                <form
                    onSubmit={createOrUpdateGroup}
                    className="p-6 overflow-y-auto dark:bg-slate-800 bg-slate-300"
                >
                    <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                        {group.id
                            ? `Edit Group ${group.name}`
                            : `Create new Group`}
                    </h2>

                    <div className="mt-8">
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            disabled={!!group.id}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            isFocused
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="description" value="Description" />
                        <TextAreaInput
                            id="description"
                            rows="3"
                            className="mt-1 block w-full"
                            value={data.description || ""}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />
                        <InputError
                            className="mt-2"
                            message={errors.description}
                        />
                    </div>

                    <div className="mt-4">
                        <InputLabel value="Select Users" />
                        <UserPicker
                            value={
                                users.filter((u) =>
                                    // group.owner_id !== u.id &&
                                    data.user_ids.includes(u.id)
                                ) || []
                            }
                            options={users}
                            onSelect={(users) =>
                                setData(
                                    "user_ids",
                                    users.map((u) => u.id)
                                )
                            }
                        />
                        <InputError
                            className="mt-2"
                            message={errors.user_ids}
                        />
                    </div>

                    <div className="flex mt-6 justify-end">
                        <SecondaryButton onClick={closeModal}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            type="submit"
                            className="ms-3"
                            disabled={processing}
                        >
                            {group.id ? "Update" : "Create"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}
