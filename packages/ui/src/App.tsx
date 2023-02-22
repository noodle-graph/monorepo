import React, { useEffect, useState } from 'react';

import './App.css';

import { Details } from './Details';
import { Filter } from './Filter';
import { Pill } from './Pill';
import { VisNetwork } from './VisNetowrk';

export function App() {
    const [scanOutput, setScanOutput] = useState<any>();
    const [tags, setTags] = useState<any[]>([]);

    const selectedTags = tags.filter((tag) => tag.selected);
    const selectedTagValues = selectedTags.map((tag) => tag.value);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'scanOutput.js';
        script.async = true;
        script.onload = function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const scanOutputNew = window.scanOutput;
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
        setSelectedNode(null);
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
            <div className="w-96 bg-darker overflow-auto flex flex-col p-5">
                <Filter options={tags} onChange={handleFilterChange} title="Tags" />
                <div className="flex flex-wrap text-xs gap-1 mt-1 rounded">
                    {selectedTags.map((tag, i) => (
                        <Pill key={`pill-${i}`} onClick={() => handlePillClick(tag)} label={tag.value} />
                    ))}
                </div>
                {selectedNode && <Details node={scanOutput.resources.find((r) => (r.id = selectedNode))!} />}
            </div>
            <div className="w-screen h-screen">
                {scanOutput && <VisNetwork scanOutput={scanOutput} selectedTags={selectedTagValues} selectNode={(nodeId) => setSelectedNode(nodeId)} />}
            </div>
        </div>
    );
}
