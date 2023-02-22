import React from 'react';

import { Resource } from './VisNetowrk';

interface DetailProps {
    node: Resource;
}

function detail(name: string, content: any) {
    return (
        <div className="flex justify-between flex-col pt-3">
            <div className="font-bold">{name}</div>
            <div>{content}</div>
        </div>
    );
}

function link(text: string, url: string) {
    return (
        <a className="text-secondary" href={url ?? ''} target="_blank">
            {text}
        </a>
    );
}

export function Details(props: DetailProps) {
    return (
        <div className="bottom-0 bg-darker p-5">
            <div className="flex h-full flex-wrap flex-col">
                {detail('Id', props.node.id)}
                {detail('Name', props.node.name)}
                {detail('Type', props.node.type)}
                {props.node.url && detail('Source', link('Link', props.node.url))}
                {detail('Description', props.node.description)}
                {detail(
                    'Relationships',
                    props.node.relationships?.map((r, i) => <div key={i}>{link(r.resourceId, r.url)}</div>)
                )}
            </div>
        </div>
    );
}
