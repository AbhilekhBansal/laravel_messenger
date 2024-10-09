import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Transition,
} from "@headlessui/react";
import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import { Fragment, useState } from "react";

export default function UserPicker({ value, options, onSelect }) {
    const [selected, setSelected] = useState(value);
    const [query, setQuery] = useState("");

    const filteredPeople =
        query === ""
            ? options
            : options.filter((person) =>
                  person.name
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, ""))
              );

    const onSelected = (persons) => {
        setSelected(persons);
        onSelect(persons);
    };

    return (
        <>
            <Combobox value={selected} onChange={onSelected} multiple>
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75  focus-visible:ring-offset-2 focus-visible:ring-teal-300 sm:text-sm">
                        <ComboboxInput
                            className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300  focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm  mt-1 block w-full "
                            displayValue={(persons) => {
                                persons.length
                                    ? `${persons.length} users selected`
                                    : "";
                            }}
                            placeholder={` ${selected.length} select users...`}
                            onChange={(ev) => setQuery(ev.target.value)}
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex pr-2 items-center">
                            <ChevronDownIcon
                                className="w-5 h-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </ComboboxButton>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <ComboboxOptions className="absolute mt-1 max-h-60 w-full  overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus: outline-none sm:text-sm">
                            {filteredPeople.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                    Nothing Found
                                </div>
                            ) : (
                                filteredPeople.map((person) => (
                                    <ComboboxOption
                                        key={person.id}
                                        className={({ active }) =>
                                            ` flex cursor-default select-none py-2 pl-10 pr-4 ${
                                                active
                                                    ? "bg-teal-600 text-white"
                                                    : "bg-gray-900 text-gray-100"
                                            }`
                                        }
                                        value={person}
                                    >
                                        {({ selected }) => (
                                            <>
                                                {/* {selected ? (
                                                    <CheckIcon
                                                        className="w-5 h-5 text-primary "
                                                        aria-hidden="true"
                                                    />
                                                ) : null} */}
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? "font-bold text-primary"
                                                            : "font-normal"
                                                    }`}
                                                >
                                                    {person.name}
                                                </span>
                                            </>
                                        )}
                                    </ComboboxOption>
                                ))
                            )}
                        </ComboboxOptions>
                    </Transition>
                </div>
            </Combobox>
            {selected && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {selected.map((person) => (
                        <div
                            title={person.name}
                            key={person.id}
                            className="badge badge-primary gap-1  w-fit h-fit text-center "
                        >
                            {person.name.slice(0, 15) + "..."}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
