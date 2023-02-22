import React, { useState } from 'react';

import './App.css';

import { Details } from './Details';
import { Filter } from './Filter';
import { Pill } from './Pill';
import { VisNetwork } from './VisNetowrk';
import scanOutput from './data/scanOutput.json';

export function App() {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const tags = [...new Set(scanOutput.resources.flatMap((resource) => resource.tags ?? []))];
    const tagsForFilter = tags.map((tag) => ({
        key: tag,
        value: tag,
        display: tag,
    }));

    return (
        <>
            <div className="flex h-screen">
                <div className="w-96 bg-darker overflow-auto flex flex-col p-5">
                    <Filter options={tagsForFilter} onChange={(value) => setSelectedTags(value)} title="Tags" />
                    <div className="flex flex-wrap text-xs gap-1 mt-1 rounded">
                        {selectedTags.map((tag) => (
                            <Pill onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))} label={tag} />
                        ))}
                    </div>
                </div>
                <div className="w-screen h-screen">
                    <VisNetwork scanOutput={scanOutput} selectedTags={selectedTags} selectNode={(e) => setSelectedNode(e)} />
                </div>
            </div>
            {selectedNode && <Details node={scanOutput.resources.find((r) => (r.id = selectedNode))!} />}
        </>
    );
}
