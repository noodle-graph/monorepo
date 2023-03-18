import { Switch } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';

export interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
}

export function Toggle(props: ToggleProps) {
    return (
        <Switch
            checked={props.checked}
            onChange={props.onChange}
            className="h-9 text-secondary bg-secondary font-extrabold hover:text-primary transition-colors p-1 pr-2 text-xs flex items-center rounded gap-2"
        >
            <div className="h-7 w-7 bg-darker rounded p-1 text-secondary">{props.checked && <CheckIcon />}</div>
            <span>{props.label}</span>
        </Switch>
    );
}
