import { useEffect, useState } from 'react';

import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import { Pill } from './Pill';
import { Select } from './Select';
import { scanOutputStore } from './scanOutputStore';
import type { ResourceExtended, SelectOption } from './types';

interface ResourceEditModalProps {
    resource?: ResourceExtended;
    isOpen: boolean;
    close: () => void;
    save: (resource: ResourceExtended) => void;
}

// TODO: Extract to shared component with the scanner.
function isValidResource(resource: Partial<ResourceExtended>): resource is ResourceExtended {
    return !!(resource.id && /[a-z0-9-]+/.test(resource.id));
}

export function ResourceEditModal(props: ResourceEditModalProps) {
    const [resource, setResource] = useState<Partial<ResourceExtended>>({ ...(props.resource ?? {}) });

    const resourceIdOptions: SelectOption<string>[] = scanOutputStore.scanOutput.resources.map((resource) => ({
        key: resource.id,
        value: resource.id,
        display: resource.name ?? resource.id,
    }));

    useEffect(() => {
        setResource({ ...(props.resource ?? {}) });
    }, [props.resource]);

    function handleSave() {
        if (isValidResource(resource)) props.save(resource);
    }

    function addRelationship(resourceId: string) {
        resource.relationships ??= [];
        resource.relationships.push({
            resourceId,
            from: false,
            to: true,
            resource: scanOutputStore.scanOutput.resources.find((r) => r.id === resourceId),
        });
        setResource({ ...resource });
    }

    function removeRelationship(resourceId: string) {
        setResource({ ...resource, relationships: resource.relationships?.filter((r) => r.resourceId !== resourceId) });
    }

    function handleClose() {
        setResource({});
        props.close();
    }

    return (
        <Modal isOpen={props.isOpen} close={handleClose} title={props.resource?.name ?? props.resource?.id ?? 'New resource'}>
            <div className="flex gap-6 flex-col">
                <div className="flex gap-2 flex-wrap">
                    <Input label="ID" id="edit-resource-id" value={resource.id} onChange={(value) => setResource({ ...resource, id: value })} />
                    <Input label="Name" id="edit-resource-name" value={resource.name} onChange={(value) => setResource({ ...resource, name: value })} />
                    <Input label="Type" id="edit-resource-type" value={resource.type} onChange={(value) => setResource({ ...resource, type: value })} />
                    {/* TODO: Tags */}
                </div>
                <div className="flex flex-col gap-2 items-start">
                    <h2 className="text-xs font-black text-secondary">Relationships</h2>
                    <div className="flex flex-wrap gap-2">
                        {resource.relationships?.map((r) => (
                            <Pill label={r.resource?.name ?? r.resourceId} onClick={() => removeRelationship(r.resourceId)} />
                        ))}
                    </div>
                    <Select title="Add relationship" options={resourceIdOptions} onChange={addRelationship} />
                </div>
                <div>
                    <Button label={props.resource ? 'Save' : 'Add'} onClick={handleSave} />
                </div>
            </div>
        </Modal>
    );
}
