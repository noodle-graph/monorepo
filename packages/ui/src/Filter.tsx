import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useState } from 'react';

export type FilterOption<T> = { key: string; value: T; display: string };

export interface FilterProps<T> {
    title: string;
    options: FilterOption<T>[];
    onChange: (values: T[]) => void;
}

export function Filter<T>(props: FilterProps<T>) {
    const [query, setQuery] = useState<string>('');
    const filteredOptions = props.options.filter((option) => option.display.toLowerCase().includes(query.toLowerCase()));

    return (
        <Combobox onChange={props.onChange} multiple>
            <div className="relative">
                <div className="mb-1">
                    <Combobox.Label className="text-secondary text-xs font-bold">{props.title}</Combobox.Label>
                </div>
                <div className="bg-secondary rounded flex items-center">
                    <Combobox.Input className="p-2 bg-[#00000000] outline-none border-none flex-1" onChange={(event) => setQuery(event.target.value)} />
                    <Combobox.Button className="flex-0 pr-1">
                        <ChevronUpDownIcon className="h-5 w-5 text-disabled" aria-hidden="true" />
                    </Combobox.Button>
                </div>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery('')}>
                    <Combobox.Options className="absolute max-h-60 w-full overflow-auto bg-secondary p-1 block">
                        {filteredOptions.map((option) => (
                            <Combobox.Option key={option.key} value={option.value} className="p-1 flex items-center text-secondary">
                                {({ selected }) => (
                                    <>
                                        {selected ? <CheckIcon className="w-5 h-5 mr-1" /> : <div className="w-5 h-5 mr-1"></div>}
                                        <div>{option.display}</div>
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
}
