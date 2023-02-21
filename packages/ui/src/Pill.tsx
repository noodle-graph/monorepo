import { XMarkIcon } from '@heroicons/react/20/solid';

export interface PillProps {
    onClick: () => void;
    label: string;
}

export function Pill(props: PillProps) {
    return (
        <div className="text-secondary bg-secondary p-1.5 flex items-center rounded">
            <div>{props.label}</div>
            <button onClick={() => props.onClick()}>
                <XMarkIcon className="w-3 h-3 ml-1" />
            </button>
        </div>
    );
}

Pill.defaultProps = {
    disabled: false,
    color: 'secondary',
};
