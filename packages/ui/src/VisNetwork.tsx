/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { DataSet, DataView } from 'vis-data';
import { Network } from 'vis-network';

import { getTypeImagePath } from './constants';
import type { ResourceExtended } from './types';

export interface VisNetworkProps {
    scanOutput: {
        resources: ResourceExtended[];
    };
    selectedTags: string[];
    selectNode: (nodeId: string) => void;
    selectedNode: string | undefined;
}

export class VisNetwork extends React.Component<VisNetworkProps> {
    private container = React.createRef<HTMLDivElement>();
    private edges: any;
    private nodes: any;
    private network?: Network;

    public constructor(props: VisNetworkProps) {
        super(props);
    }

    private produceNetwork(): void {
        this.nodes = this.extractNodes();
        this.edges = this.extractEdges();

        let i = 0;
        // eslint-disable-next-line node/no-unsupported-features/es-builtins
        const groups = Object.fromEntries(
            [...new Set<string>(this.nodes.map((node: any) => node.group)).values()].map((group) => [
                group,
                {
                    id: i++,
                    shape: 'image',
                    image: getTypeImagePath(group),
                },
            ])
        );

        this.network = new Network(
            this.container.current!,
            { nodes: this.nodes, edges: this.edges },
            {
                physics: {
                    solver: 'hierarchicalRepulsion',
                    hierarchicalRepulsion: {
                        nodeDistance: 175,
                        avoidOverlap: 0.5,
                    },
                },
                interaction: { hover: true },
                edges: {
                    smooth: false,
                    color: '#f1f5f9',
                    chosen: false,
                    font: {
                        color: '#94a3b8',
                        background: '#1e293b',
                        strokeWidth: 0,
                    },
                    arrowStrikethrough: false,
                },
                nodes: {
                    color: '#94a3b8',
                    font: {
                        color: '#f1f5f9',
                        background: '#1e293b',
                    },
                },
                groups,
            }
        );
        this.network.on('click', (e) => {
            this.props.selectNode(e.nodes[0]);
        });
    }

    private extractNodes() {
        return new DataView(
            new DataSet(
                this.props.scanOutput.resources.map((resource: ResourceExtended) => ({
                    id: resource.id,
                    label: resource.name ?? resource.id,
                    group: resource.type ?? resource.source,
                    tags: resource.tags as any,
                }))
            ),
            {
                filter: (node) => this.props.selectedTags.length === 0 || this.props.selectedTags.every((tag) => node.tags?.includes(tag)),
            }
        );
    }

    private extractEdges() {
        let i = 0;

        const edges: Record<string, any> = {};
        for (const resource of this.props.scanOutput.resources) {
            for (const relationship of resource.relationships ?? []) {
                const key = [resource.id, relationship.resourceId].sort().join(',');
                if (!edges[key]) {
                    edges[key] = {
                        id: i++,
                        from: resource.id,
                        to: relationship.resourceId,
                        arrowFrom: false,
                        arrowTo: false,
                        label: '',
                        tags: [],
                    };
                }
                edges[key].label += relationship.action ? `${edges[key].label ? '\n' : ''}${relationship.action}` : '';
                edges[key].tags = [...new Set(...edges[key].tags, ...(relationship.tags ?? []))];

                edges[key].arrowFrom ||= relationship.from;
                edges[key].arrowTo ||= relationship.to;
                edges[key].arrows = [edges[key].arrowFrom && 'from', edges[key].arrowTo && 'to'].filter(Boolean).join(', ');
            }
        }

        return new DataView(new DataSet(Object.values(edges), {}));
    }

    public override componentDidMount(): void {
        this.produceNetwork();
    }

    public override componentDidUpdate(prevProps: VisNetworkProps): void {
        if (this.network && prevProps.selectedNode) {
            for (const edge of this.network.getConnectedEdges(prevProps.selectedNode)) {
                this.network.updateEdge(edge, { width: 1 });
            }
        }
        if (this.network && this.props.selectedNode != null && prevProps.selectedNode !== this.props.selectedNode) {
            this.network.focus(this.props.selectedNode, {
                scale: 1,
                locked: false,
                animation: true,
            });
            for (const edge of this.network.getConnectedEdges(this.props.selectedNode)) {
                this.network.updateEdge(edge, { width: 3 });
            }
        }

        this.nodes.refresh();
    }

    public override render() {
        return <div ref={this.container} className="w-full h-full" />;
    }
}
