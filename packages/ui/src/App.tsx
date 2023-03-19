import { ArrowDownTrayIcon, FolderArrowDownIcon, PlusIcon } from '@heroicons/react/20/solid';
import type { Resource } from '@noodle-graph/types';
import React, { useEffect, useState } from 'react';

import './App.css';

import { Button } from './Button';
import { Details } from './Details';
import { Filter } from './Filter';
import { NewResourceModal } from './NewResourceModal';
import { Pill } from './Pill';
import { Select } from './Select';
import { Toggle } from './Toggle';
import { VisNetwork } from './VisNetwork';
import { scanOutputStore } from './scanOutputStore';
import type { ScanResultExtended, SelectOption, FilterOption } from './types';
import { everyIncludes, produceNewRelationship } from './utils';

export function App() {
    const [withDiff, setWithDiff] = useState(true);

    const [scanOutput, setScanOutput] = useState<ScanResultExtended>();
    const [tags, setTags] = useState<FilterOption<string>[]>([]);
    const [resources, setResources] = useState<SelectOption<string>[]>([]);
    const [selectedResourceId, setSelectedResourceId] = useState<string>();
    const [isResourceEditOpen, setIsResourceEditOpen] = useState<boolean>(false);

    const selectedTags = tags.filter((tag) => tag.selected);
    const selectedTagValues = selectedTags.map((tag) => tag.value);
    const selectedResource = selectedResourceId ? scanOutput?.resources.find((r) => r.id === selectedResourceId) : undefined;

    useEffect(() => {
        scanOutputStore.importBundledScanOutput().then(syncWithStore);
    }, []);

    useEffect(() => {
        if (!everyIncludes(selectedTagValues, selectedResource?.tags ?? [])) {
            setSelectedResourceId(undefined);
        }
    }, [tags]);

    function syncWithStore() {
        setScanOutput(JSON.parse(JSON.stringify(scanOutputStore.scanOutput)));
        setTags(scanOutputStore.extractTagOptions());
        setResources(scanOutputStore.extractResourceOptions());
    }

    function handleTagPillClick(clickedTag: SelectOption<string>): void {
        const newTags = JSON.parse(JSON.stringify(tags));
        newTags.find((tag) => tag.value === clickedTag.value).selected = false;
        setTags(newTags);
    }

    function handleTagsSelectionChange(values: string[]): void {
        const newTags = JSON.parse(JSON.stringify(tags));
        for (const tag of newTags) {
            tag.selected = values.includes(tag.value);
        }
        setTags(newTags);
    }

    function closeResourceEditModal() {
        setIsResourceEditOpen(false);
    }

    function handleNewResource(resource: Resource): void {
        const extendedResource = scanOutputStore.addResource(resource);
        VisNetwork.addResource(extendedResource);
        syncWithStore();
        closeResourceEditModal();
    }

    function handleRemoveResource(resourceId: string): void {
        const resource = scanOutputStore.removeResource(resourceId);
        if (resource) {
            VisNetwork.updateResource(resource);
            for (const relationship of resource.relationships ?? []) {
                if ((relationship.diff ?? resource.diff) === '+') {
                    resource.relationships = resource.relationships?.filter((r) => r.resourceId !== relationship.resourceId);
                    VisNetwork.removeRelationship(resourceId, relationship.resourceId);
                } else {
                    VisNetwork.updateRelationship(resource, relationship);
                }
            }
        } else VisNetwork.removeResource(resourceId);
        syncWithStore();
    }

    function handleAddRelationship(resourceId: string, relationshipResourceId: string): void {
        const resource = scanOutputStore.scanOutput.resources.find((r) => r.id === resourceId);
        if (!resource) throw new Error('Invalid resource');
        const relationship = produceNewRelationship({ resourceId: relationshipResourceId });
        resource.relationships ??= [];
        resource.relationships.push(relationship);
        VisNetwork.addRelationship(resource, relationship);
        syncWithStore();
    }

    function handleRemoveRelationship(resourceId: string, relationshipResourceId: string): void {
        const resource = scanOutputStore.scanOutput.resources.find((r) => r.id === resourceId);
        if (!resource) throw new Error('Invalid resource');
        // XXX: This might be incorrect if there are more than one relationship to that resource
        const relationship = resource.relationships?.find((r) => r.diff !== '-' && r.resourceId === relationshipResourceId);
        if (!relationship) throw new Error('Invalid relationship');
        if ((relationship.diff ?? resource.diff) === '+') {
            resource.relationships = resource.relationships?.filter((r) => r.resourceId !== relationshipResourceId);
            VisNetwork.removeRelationship(resourceId, relationshipResourceId);
        } else {
            relationship.diff = '-';
            VisNetwork.updateRelationship(resource, relationship);
        }
        syncWithStore();
    }

    return scanOutput == null ? (
        <div>Loading...</div>
    ) : (
        <div className="flex h-screen">
            <div className="w-96 bg-darker overflow-auto flex flex-col p-5 gap-5">
                <div className="flex justify-between items-center gap-1 mb-7">
                    <h1 className="text-xl font-black opacity-70">Noodle</h1>
                    <a href="https://github.com/noodle-graph/monorepo" className="h-5 w-5 opacity-70 hover:opacity-100 transition-opacity" target="_blank">
                        <img src="img/github.svg" />
                    </a>
                </div>
                <div className="flex gap-1 flex-wrap">
                    <Button label="Download" onClick={() => scanOutputStore.download()} icon={FolderArrowDownIcon} />
                    <Button label="Import" onClick={() => scanOutputStore.import().then(syncWithStore)} icon={ArrowDownTrayIcon} />
                    <Button label="Add Resource" onClick={() => setIsResourceEditOpen(true)} icon={PlusIcon} />
                    <Toggle label="Show diff" checked={withDiff} onChange={setWithDiff} />
                </div>
                <Filter options={tags} onChange={handleTagsSelectionChange} title="Tags" />
                <Select options={resources} onChange={setSelectedResourceId} title="Resource" />
                <div className="flex flex-wrap text-xs gap-1 mt-1 rounded">
                    {selectedTags.map((tag, i) => (
                        <Pill key={`pill-${i}`} onClick={() => handleTagPillClick(tag)} label={tag.value} />
                    ))}
                </div>
                {selectedResource && (
                    <Details
                        resource={selectedResource}
                        resourceSelected={setSelectedResourceId}
                        removeResource={handleRemoveResource}
                        addRelationship={handleAddRelationship}
                        removeRelationship={handleRemoveRelationship}
                    />
                )}
            </div>
            <div>
                {scanOutput && (
                    <VisNetwork
                        scanOutput={scanOutput}
                        selectedTags={selectedTagValues}
                        resourceSelected={setSelectedResourceId}
                        selectedResourceId={selectedResourceId}
                        withDiff={withDiff}
                    />
                )}
            </div>
            <NewResourceModal isOpen={isResourceEditOpen} close={closeResourceEditModal} save={handleNewResource} />
        </div>
    );
}
