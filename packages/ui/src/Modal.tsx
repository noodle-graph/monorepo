import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface ModalProps {
    isOpen: boolean;
    close: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal(props: ModalProps) {
    return (
        <Dialog open={props.isOpen} onClose={() => props.close()} className="z-50 fixed inset-0 flex items-center justify-center">
            <div className="fixed inset-0 bg-darker opacity-50" />
            <Dialog.Panel className="z-50 p-5 bg-darker w-96">
                <Dialog.Title className="text-xl font-black">{props.title}</Dialog.Title>
                <button onClick={() => props.close()}>
                    <XMarkIcon />
                </button>
                {props.children}
            </Dialog.Panel>
        </Dialog>
    );
}
