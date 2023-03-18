import { Combobox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useState } from 'react';

import type { SelectOption } from './types';

export interface SelectProps<T> {
    title: string;
    options: SelectOption<T>[];
    onChange: (value: T) => void;
}

export function Select<T>(props: SelectProps<T>) {
    const [query, setQuery] = useState<string>('');

    const filteredOptions = props.options.filter((option) => option.display.toLowerCase().includes(query.toLowerCase()));

    return (
        <Combobox onChange={props.onChange}>
            <div className="relative">
                <div className="mb-1">
                    <Combobox.Label className="text-secondary text-xs font-bold">{props.title}</Combobox.Label>
                </div>
                <div className="bg-secondary rounded flex items-center">
                    <Combobox.Input
                        className="p-2 bg-[#00000000] outline-none border-none flex-1"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(selected: SelectOption<string>) => selected.display}
                    />
                    <Combobox.Button className="flex-0 pr-1">
                        <ChevronUpDownIcon className="h-5 w-5 text-disabled" aria-hidden="true" />
                    </Combobox.Button>
                </div>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery('')}>
                    <Combobox.Options className="absolute max-h-60 w-full overflow-auto bg-secondary p-1 block z-50">
                        {filteredOptions.map((option) => (
                            <Combobox.Option
                                key={`select-${option.key}`}
                                value={option.value}
                                className="p-1 flex items-center text-secondary hover:text-primary transition-colors cursor-pointer"
                            >
                                {option.display}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
}
