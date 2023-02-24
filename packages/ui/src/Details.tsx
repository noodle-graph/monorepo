import React, { ReactElement } from 'react';

import { Pill } from './Pill';
import { getTypeImagePath, prettifySource } from './constants';
import { Relationship, Resource } from './types';

interface DetailProps {
    resource: Resource;
    resourceSelected: (string) => void;
}

function detail(name: string, content?: ReactElement | string): JSX.Element | false {
    return (
        !!content && (
            <div className="flex justify-between flex-col gap-1">
                <div className="font-bold text-xs text-disabled">{name}</div>
                <div className="font-bold text-sm text-secondary">{content}</div>
            </div>
        )
    );
}

function link(text: string, url: string): JSX.Element {
    return (
        <a className="border-b border-text-primary hover:border-text-secondary transition-colors" href={url ?? ''} target="_blank">
            {text}
        </a>
    );
}

export function Details(props: DetailProps) {
    const prettySource = prettifySource(props.resource.source);

    function relationship(relationship: Relationship) {
        return (
            <div
                className="flex flex-col bg-primary text-secondary p-4 rounded mt-1 cursor-pointer border border-bg-primary hover:border-secondary transition-colors"
                onClick={() => props.resourceSelected(relationship.resourceId)}
            >
                <div className="flex align-center gap-2 text-sm">
                    {relationship.resource?.type && <img src={getTypeImagePath(relationship.resource.type)} className="max-h-5" />}
                    {relationship.resource?.name ?? relationship.resourceId}
                </div>
                {relationship.tags && (
                    <div className="flex flex-wrap gap-2 text-xs mt-2">
                        {relationship.tags?.map((tag) => (
                            <Pill label={tag} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bottom-0 bg-darker">
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                    {props.resource.type && <img src={getTypeImagePath(props.resource.type)} className="max-h-7" />}
                    <div className="text-xl font-bold">{props.resource.name}</div>
                    <div className="h-0.5 bg-secondary flex-1"></div>
                </div>
                {props.resource.description && <div className="text-secondary text-sm font-bold">{props.resource.description}</div>}
                {detail('ID', props.resource.id)}
                {detail('Type', props.resource.type)}
                {detail('Source', props.resource.url ? link(prettySource, props.resource.url) : prettySource)}
                {detail(
                    'Relationships',
                    props.resource.relationships && (
                        <>
                            {props.resource.relationships?.map((r, i) => (
                                <div key={`details-relationship-${i}`}>{relationship(r)}</div>
                            ))}
                        </>
                    )
                )}
                {detail(
                    'Tags',
                    props.resource.tags && (
                        <div className="flex flex-wrap gap-2 text-xs mt-2">
                            {props.resource.tags?.map((tag) => (
                                <Pill label={tag} />
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
