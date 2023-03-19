import { useEffect, useState } from 'react';

import { Button } from './Button';
import { Filter } from './Filter';
import { Input } from './Input';
import { Modal } from './Modal';
import { Pill } from './Pill';
import { scanOutputStore } from './scanOutputStore';
import type { FilterOption, ResourceExtended } from './types';
import { produceNewRelationship } from './utils';

interface NewResourceModalProps {
    isOpen: boolean;
    close: () => void;
    save: (resource: ResourceExtended) => void;
}

// TODO: Extract to shared component with the scanner.
function isValidResource(resource: Partial<ResourceExtended>): resource is ResourceExtended {
    return !!(resource.id && /[a-z0-9-]+/.test(resource.id));
}

export function NewResourceModal(props: NewResourceModalProps) {
    const [resource, setResource] = useState<Partial<ResourceExtended>>({});

    const resourceIdOptions: FilterOption<string>[] = scanOutputStore.scanOutput.resources.map((r) => ({
        key: r.id,
        value: r.id,
        display: r.name ?? r.id,
        selected: resource.relationships?.some((relationship) => relationship.resourceId === r.id) ?? false,
    }));

    useEffect(() => {
        setResource({});
    }, [props.isOpen]);

    function handleSave() {
        if (isValidResource(resource)) props.save(resource);
    }

    function handleRelationshipsChanged(values: string[]) {
        setResource({
            ...resource,
            relationships: values.map((v) => ({
                ...produceNewRelationship({ resourceId: v }),
                resource: scanOutputStore.scanOutput.resources.find((r) => r.id === v),
            })),
        });
    }

    function removeRelationship(resourceId: string) {
        setResource({ ...resource, relationships: resource.relationships?.filter((r) => r.resourceId !== resourceId) });
    }

    function handleClose() {
        setResource({});
        props.close();
    }

    return (
        <Modal isOpen={props.isOpen} close={handleClose} title={'New resource'}>
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
                            <Pill key={`edit-relationship-${r.resourceId}`} label={r.resource?.name ?? r.resourceId} onClick={() => removeRelationship(r.resourceId)} />
                        ))}
                    </div>
                    <Filter title="Add relationship" options={resourceIdOptions} onChange={handleRelationshipsChanged} />
                </div>
                <div>
                    <Button label={'Add'} onClick={handleSave} />
                </div>
            </div>
        </Modal>
    );
}
