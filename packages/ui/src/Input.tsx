import { useRef } from 'react';

interface InputProps {
    id: string;
    placeholder?: string;
    label: string;
    type?: string;
    onChange?: (value: string) => void;
    value?: string;
}

export function Input(props: InputProps): React.ReactElement {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="bg-secondary p-1 px-2 border-0 outline-none rounded" onClick={() => inputRef.current?.focus()}>
            <label htmlFor={props.id} className="mr-2 text-secondary font-bold text-xs">
                {props.label}
            </label>
            <input
                ref={inputRef}
                value={props.value ?? ''}
                type={props.type}
                className="bg-primary outline-none p-1 px-2 rounded text-primary font-mono"
                id={props.id}
                placeholder={props.placeholder}
                onChange={(e) => props.onChange?.(e.target.value)}
            />
        </div>
    );
}

Input.defaultProps = {
    type: 'text',
};
