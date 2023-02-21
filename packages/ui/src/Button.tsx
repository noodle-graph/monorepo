export interface ButtonProps {
    onClick: () => void;
    disabled?: boolean;
    label: string;
    color?: 'secondary' | 'primary';
}

export function Button(props: ButtonProps) {
    return (
        <button disabled={props.disabled} className={`text-sm p-2 rounded bg-color-${props.color} color-secondary`} onClick={props.onClick}>
            {props.label}
        </button>
    );
}

Button.defaultProps = {
    disabled: false,
    color: 'secondary',
};
