interface ButtonProps {
    onClick: () => void;
    label: string;
    icon?: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string }>;
}

export function Button(props: ButtonProps) {
    return (
        <button
            onClick={() => props.onClick!()}
            className="text-secondary font-extrabold hover:text-primary transition-colors bg-secondary p-2 pr-3 text-xs flex items-center rounded gap-1"
        >
            {props.icon && <props.icon width={15} />}
            <div>{props.label}</div>
        </button>
    );
}
