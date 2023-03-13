import type { Resource } from '@noodle-graph/types';
import React, { useEffect, useState } from 'react';

import './App.css';

import { Details } from './Details';
import { Filter } from './Filter';
import { Pill } from './Pill';
import { Select } from './Select';
import { VisNetwork } from './VisNetwork';
import type { ResourceExtended, ScanResultExtended, Selection, SelectionMultiple } from './types';

export function App() {
    const [scanOutput, setScanOutput] = useState<ScanResultExtended>();
    const [tags, setTags] = useState<SelectionMultiple<string>[]>([]);
    const [resources, setResources] = useState<Selection<string>[]>([]);

    const selectedTags = tags.filter((tag) => tag.selected);
    const selectedTagValues = selectedTags.map((tag) => tag.value);
    const [selectedResourceId, setSelectedResourceId] = useState<string>();

    const selectedNode = selectedResourceId && scanOutput?.resources.find((r) => r.id === selectedResourceId);

    useEffect(() => {
        fetch('scanOutput.json').then(async (response) => {
            const scanOutputNew = await response.json();

            // TODO: This should not be in the UI, but for now it is good enough...
            for (const resource of scanOutputNew.resources) {
                for (const relationship of resource.relationships ?? []) {
                    relationship.resource = {
                        ...scanOutputNew.resources.find((r: Resource) => r.id === relationship.resourceId),
                        relationships: undefined,
                    };
                }
            }

            setScanOutput(scanOutputNew);

            const tagValues = [...new Set<string>(scanOutputNew.resources.flatMap((resource: ResourceExtended) => resource.tags ?? []))];
            setTags(
                tagValues.map((tag: string) => ({
                    key: tag,
                    value: tag,
                    display: tag,
                    selected: false,
                }))
            );

            setResources(
                scanOutputNew.resources.map((resource) => ({
                    key: resource.id,
                    value: resource.id,
                    display: resource.name ?? resource.id,
                }))
            );
        });
    }, []);

    useEffect(() => {
        setSelectedResourceId(undefined);
    }, [tags]);

    function handlePillClick(clickedTag: Selection<string>): void {
        const newTags = JSON.parse(JSON.stringify(tags));

        for (const tag of newTags) {
            if (tag.value === clickedTag.value) {
                tag.selected = false;
            }
        }

        setTags(newTags);
    }

    function handleFilterChange(values: string[]): void {
        const newTags = JSON.parse(JSON.stringify(tags));

        for (const tag of newTags) {
            tag.selected = values.includes(tag.value);
        }

        setTags(newTags);
    }

    return scanOutput == null ? (
        <div>Loading...</div>
    ) : (
        <div className="flex h-screen">
            <div className="w-96 bg-darker overflow-auto flex flex-col p-5 gap-5">
                <Filter options={tags} onChange={handleFilterChange} title="Tags" />
                <Select options={resources} onChange={setSelectedResourceId} title="Resource" />
                <div className="flex flex-wrap text-xs gap-1 mt-1 rounded">
                    {selectedTags.map((tag, i) => (
                        <Pill key={`pill-${i}`} onClick={() => handlePillClick(tag)} label={tag.value} />
                    ))}
                </div>
                {selectedNode && <Details resource={selectedNode} resourceSelected={setSelectedResourceId} />}
            </div>
            <div>{scanOutput && <VisNetwork scanOutput={scanOutput} selectedTags={selectedTagValues} selectNode={setSelectedResourceId} selectedNode={selectedResourceId} />}</div>
        </div>
    );
}
