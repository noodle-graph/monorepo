import { ArrowDownTrayIcon, FolderArrowDownIcon } from '@heroicons/react/20/solid';
import React, { useEffect, useState } from 'react';

import './App.css';

import { Button } from './Button';
import { Details } from './Details';
import { Filter } from './Filter';
import { Pill } from './Pill';
import { Select } from './Select';
import { VisNetwork } from './VisNetwork';
import { scanOutputStore } from './scanOutputStore';
import type { ScanResultExtended, SelectOption, FilterOption } from './types';

export function App() {
    const [scanOutput, setScanOutput] = useState<ScanResultExtended>();
    const [tags, setTags] = useState<FilterOption<string>[]>([]);
    const [resources, setResources] = useState<SelectOption<string>[]>([]);
    const [selectedResourceId, setSelectedResourceId] = useState<string>();

    const selectedTags = tags.filter((tag) => tag.selected);
    const selectedTagValues = selectedTags.map((tag) => tag.value);
    const selectedResource = selectedResourceId && scanOutput?.resources.find((r) => r.id === selectedResourceId);

    useEffect(() => {
        scanOutputStore.importBundledScanOutput().then(syncWithStore);
    }, []);

    useEffect(() => {
        setSelectedResourceId(undefined);
    }, [tags]);

    function syncWithStore() {
        setScanOutput(scanOutputStore.scanOutput);
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

    return scanOutput == null ? (
        <div>Loading...</div>
    ) : (
        <div className="flex h-screen">
            <div className="w-96 bg-darker overflow-auto flex flex-col p-5 gap-5">
                <div className="flex gap-1">
                    <Button label="Download" onClick={() => scanOutputStore.download()} icon={FolderArrowDownIcon} />
                    <Button label="Import" onClick={() => scanOutputStore.import().then(syncWithStore)} icon={ArrowDownTrayIcon} />
                </div>
                <Filter options={tags} onChange={handleTagsSelectionChange} title="Tags" />
                <Select options={resources} onChange={setSelectedResourceId} title="Resource" />
                <div className="flex flex-wrap text-xs gap-1 mt-1 rounded">
                    {selectedTags.map((tag, i) => (
                        <Pill key={`pill-${i}`} onClick={() => handleTagPillClick(tag)} label={tag.value} />
                    ))}
                </div>
                {selectedResource && <Details resource={selectedResource} resourceSelected={setSelectedResourceId} />}
            </div>
            <div>
                {scanOutput && (
                    <VisNetwork scanOutput={scanOutput} selectedTags={selectedTagValues} resourceSelected={setSelectedResourceId} selectedResourceId={selectedResourceId} />
                )}
            </div>
        </div>
    );
}
