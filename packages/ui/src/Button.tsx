interface ButtonProps {
    onClick: () => void;
    label?: string;
    icon?: React.ExoticComponent<{ width: number }>;
    background?: boolean;
    danger?: boolean;
}

export function Button(props: ButtonProps) {
    return (
        <button
            onClick={() => props.onClick!()}
            className={`h-9 text-secondary font-extrabold hover:text-primary transition-colors ${
                props.background ? 'bg-secondary' : ''
            } p-2 text-xs flex items-center rounded gap-1 ${props.danger ? 'hover:bg-danger' : ''}`}
        >
            {props.icon && <props.icon width={15} />}
            {props.label && <div>{props.label}</div>}
        </button>
    );
}

Button.defaultProps = {
    background: true,
};
