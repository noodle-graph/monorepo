import React from 'react';

import { Resource } from './VisNetowrk';

interface DetailProps {
    node: Resource;
}

function detail(name: string, content: any) {
    return (
        <div className="flex w-48 h-8 justify-between mr-6">
            <span className="font-bold">{name}</span>
            <span>{content}</span>
        </div>
    );
}

export function Details(props: DetailProps) {
    return (
        <div className="fixed h-40 bottom-0 bg-darker w-screen p-5">
            <div className="flex h-full flex-wrap flex-col w-1/2">
                {detail('Id', props.node.id)}
                {detail('Name', props.node.name)}
                {detail('Type', props.node.type)}
                {detail(
                    'Source',
                    <a className="text-blue-600" href={props.node.url ?? ''} target="_blank">
                        Link
                    </a>
                )}
            </div>
        </div>
    );
}
