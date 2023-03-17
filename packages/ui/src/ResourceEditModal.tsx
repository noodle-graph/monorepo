import type { Resource } from '@noodle-graph/types';
import { useEffect, useState } from 'react';

import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';

interface ResourceEditModalProps {
    resource?: Resource;
    isOpen: boolean;
    close: () => void;
    save: (resource: Resource) => void;
}

// TODO: Extract to shared component with the scanner.
function isValidResource(resource: Partial<Resource>): resource is Resource {
    return !!(resource.id && /[a-z0-9-]+/.test(resource.id));
}

export function ResourceEditModal(props: ResourceEditModalProps) {
    const [resource, setResource] = useState<Partial<Resource>>({ ...(props.resource ?? {}) });

    useEffect(() => {
        setResource({ ...(props.resource ?? {}) });
    }, [props.resource]);

    function handleSave() {
        if (isValidResource(resource)) props.save(resource);
    }

    function handleClose() {
        setResource({});
        props.close();
    }

    return (
        <Modal isOpen={props.isOpen} close={handleClose} title={props.resource?.name ?? props.resource?.id ?? 'New resource'}>
            <div className="flex gap-2 flex-wrap">
                <Input label="ID" id="edit-resource-id" value={resource.id} onChange={(value) => setResource({ ...resource, id: value })} />
                <Input label="Name" id="edit-resource-name" value={resource.name} onChange={(value) => setResource({ ...resource, name: value })} />
                <Input label="Type" id="edit-resource-type" value={resource.type} onChange={(value) => setResource({ ...resource, type: value })} />
                {/* TODO: Tags */}
            </div>
            <div className="mt-6">
                <Button label={props.resource ? 'Add' : 'Save'} onClick={handleSave} />
            </div>
        </Modal>
    );
}
