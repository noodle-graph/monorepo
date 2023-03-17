import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

import { Button } from './Button';

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
            <Dialog.Panel className="z-50 p-5 bg-darker w-96 rounded-xl">
                <Dialog.Title className="text-xl font-black mb-5 flex justify-between items-start">
                    {props.title}
                    <Button onClick={() => props.close()} icon={XMarkIcon} background={false} />
                </Dialog.Title>
                {props.children}
            </Dialog.Panel>
        </Dialog>
    );
}
