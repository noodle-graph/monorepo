import React, { useEffect, useState } from 'react';

import './App.css';

import { Details } from './Details';
import { Filter } from './Filter';
import { Pill } from './Pill';
import { VisNetwork } from './VisNetwork';
import { Resource } from './types';

export function App() {
    const [scanOutput, setScanOutput] = useState<any>();
    const [tags, setTags] = useState<any[]>([]);

    const selectedTags = tags.filter((tag) => tag.selected);
    const selectedTagValues = selectedTags.map((tag) => tag.value);
    const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

    const selectedNode = selectedResourceId && scanOutput.resources.find((r) => r.id === selectedResourceId)!;

    useEffect(() => {
        // HACK: We had CORS problem fetching the static JSON, so we inserted it in a JS which updates the `window`.
        const script = document.createElement('script');
        script.src = 'scanOutput.js';
        script.async = true;
        script.onload = function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const scanOutputNew = window.scanOutput;

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
            const tagValues = [...new Set<string>(scanOutputNew.resources.flatMap((resource: any) => resource.tags ?? []))];
            setTags(
                tagValues.map((tag: any) => ({
                    key: tag,
                    value: tag,
                    display: tag,
                    selected: false,
                }))
            );
        };
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        setSelectedResourceId(null);
    }, [tags]);

    function handlePillClick(clickedTag) {
        const newTags = JSON.parse(JSON.stringify(tags));

        for (const tag of newTags) {
            if (tag.value === clickedTag.value) {
                tag.selected = false;
            }
        }

        setTags(newTags);
    }

    function handleFilterChange(values) {
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
