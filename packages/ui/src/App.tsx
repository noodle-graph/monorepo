import React, { useState } from 'react';

import './App.css';
import { Filter } from './Filter';
import { Pill } from './Pill';

export function App() {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const tags = ['abiafhjgsadghsdah1', 'fsiadfhsaofvlksdfjnlk2', 'fsihfksjadhf sa3']; // TODO: Take dynamically.
    const tagsForFilter = tags.map((tag) => ({
        key: tag,
        value: tag,
        display: tag,
    }));

    return (
        <div className="flex h-screen">
            <div className="w-96 bg-darker overflow-auto flex flex-col p-5">
                <Filter options={tagsForFilter} onChange={(value) => setSelectedTags(value)} title="Tags" />
                <div className="flex flex-wrap text-xs gap-1 mt-1 rounded">
                    {selectedTags.map((tag) => (
                        <Pill onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))} label={tag} />
                    ))}
                </div>
            </div>
            <div>
                <div>test</div>
            </div>
        </div>
    );
}
