import React, { useEffect, useState } from 'react';

import './App.css';
import { Filter } from './Filter';
import { Pill } from './Pill';
import { VisNetwork } from './VisNetowrk';

export function App() {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [scanOutput, setScanOutput] = useState<any>();
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        fetch('scanOutput.json', { mode: 'no-cors' })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                setScanOutput(json);
                setTags([...new Set<string>(json.resources.flatMap((resource: any) => resource.tags ?? []))]);
            });
    });

    const tagsForFilter = tags.map((tag: any) => ({
        key: tag,
        value: tag,
        display: tag,
    }));

    return scanOutput == null ? (
        <div>Loading...</div>
    ) : (
        <div className="flex h-screen">
            <div className="w-96 bg-darker overflow-auto flex flex-col p-5">
                <Filter options={tagsForFilter} onChange={(value) => setSelectedTags(value)} title="Tags" />
                <div className="flex flex-wrap text-xs gap-1 mt-1 rounded">
                    {selectedTags.map((tag) => (
                        <Pill onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))} label={tag} />
                    ))}
                </div>
            </div>
            <div className="w-screen h-screen">{scanOutput && <VisNetwork scanOutput={scanOutput} selectedTags={selectedTags} />}</div>
        </div>
    );
}
