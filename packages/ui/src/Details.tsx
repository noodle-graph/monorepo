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

export function Details(props: DetailProps) {
    const prettySource = prettifySource(props.resource.source);

    function link(text: string, url: string, iconImgSrc?: string): JSX.Element {
        return (
            <a className="border-0 border-text-secondary hover:border-opacity-50 transition-colors" href={url} target="_blank">
                {iconImgSrc && <img src={iconImgSrc} className="max-h-4 inline-block mr-1" />}
                <span className="border-b border-inherit">{text}</span>
            </a>
        );
    }

    function relationshipLink(relationshipUrl: string): ReactElement {
        return link(relationshipUrl.split('/').pop() ?? 'Link', relationshipUrl);
    }

    function relationship(relationship: Relationship) {
        return (
            <div className="flex flex-col bg-primary text-secondary p-4 rounded" onClick={() => props.resourceSelected(relationship.resourceId)}>
                <div>
                    <div className="inline-block text-sm cursor-pointer hover:bg-opacity-50 p-2 rounded bg-secondary transition-colors">
                        {relationship.resource?.type && <img src={getTypeImagePath(relationship.resource.type)} className="max-h-5 inline-block mr-2" />}
                        <span className="bg-inherit">{relationship.resource?.name ?? relationship.resourceId}</span>
                    </div>
                </div>
                {relationship.tags && (
                    <div className="flex flex-wrap gap-2 text-xs mt-2">
                        {relationship.tags?.map((tag) => (
                            <Pill label={tag} />
                        ))}
                    </div>
                )}
                <div className="mt-1">{relationshipLink(relationship.url)}</div>
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
                {detail('Source', props.resource.url ? link(prettySource, props.resource.url, props.resource.source && getTypeImagePath(props.resource.source)) : prettySource)}
                {detail(
                    'Relationships',
                    props.resource.relationships && (
                        <div className="flex flex-col gap-2">
                            {props.resource.relationships?.map((r, i) => (
                                <div key={`details-relationship-${i}`}>{relationship(r)}</div>
                            ))}
                        </div>
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
