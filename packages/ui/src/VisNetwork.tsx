/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { DataSet, DataView } from 'vis-data';
import { Network } from 'vis-network';

import { getTypeImagePath } from './constants';
import type { Diff, RelationshipExtended, ResourceExtended } from './types';
import { everyIncludes } from './utils';

const color = {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
    background: '#1e293b',
    diff: {
        '-': '#b91c1c',
        '+': '#15803d',
    },
};

const edgeWidth = {
    selected: 3,
    default: 1,
};

interface Node {
    id: string;
    label: string;
    group: string | undefined;
    tags: any;
    diff: ('+' | '-') | undefined;
    font: any;
    shape?: 'image';
    image?: string;
}

interface Edge {
    id: string;
    from: string;
    to: string;
    arrowFrom: boolean;
    arrowTo: boolean;
    labels: Set<string>;
    diff: ('+' | '-') | undefined;
    color: string | undefined;
    label?: string;
    arrows?: string;
    width?: number;
}

interface Group {
    id: string;
    shape: string;
    image: string;
}

export interface VisNetworkProps {
    scanOutput: {
        resources: ResourceExtended[];
    };
    selectedTags: string[];
    selectedResourceId: string | undefined;
    resourceSelected: (nodeId: string | undefined) => void;
    withDiff: boolean;
}

export class VisNetwork extends React.Component<VisNetworkProps> {
    private container = React.createRef<HTMLDivElement>();

    private static groups: Record<string, Group>;
    private static edges: DataView<Edge>;
    private static nodes: DataView<any>;
    private static network?: Network;

    public static addResource(resource: ResourceExtended) {
        const node = produceNode(resource);
        if (node.group && !VisNetwork.groups[node.group]) {
            node.shape = 'image';
            node.image = getTypeImagePath(node.group);
        }
        VisNetwork.nodes.getDataSet().add(node);
        for (const relationship of resource.relationships ?? []) {
            this.addRelationship(resource, relationship);
        }
    }

    public static updateResource(resource: ResourceExtended) {
        VisNetwork.nodes.getDataSet().update(produceNode(resource));
    }

    public static removeResource(resourceId: string) {
        VisNetwork.nodes.getDataSet().remove(resourceId);
    }

    public static addRelationship(resource: ResourceExtended, relationship: RelationshipExtended) {
        const edge = VisNetwork.edges.get(produceEdgeId(resource.id, relationship.resourceId)) ?? produceEdge(resource, relationship);
        enrichEdgeForVis(edge);
        if (VisNetwork.network?.getSelectedNodes().includes(resource.id)) {
            edge.width = edgeWidth.selected;
        }
        VisNetwork.edges.getDataSet().add(edge);
    }

    public static updateRelationship(resource: ResourceExtended, relationship: RelationshipExtended) {
        if (resource.diff ?? relationship.diff) {
            const existingEdge = VisNetwork.edges.get(produceEdgeId(resource.id, relationship.resourceId));
            VisNetwork.edges.getDataSet().update({ ...existingEdge, color: produceEdgeColor(resource.diff, relationship.diff) });
        }
    }

    public static removeRelationship(resourceId: string, relationshipResourceId: string) {
        VisNetwork.edges.getDataSet().remove(produceEdgeId(resourceId, relationshipResourceId));
    }

    public constructor(props: VisNetworkProps) {
        super(props);
    }

    private produceNetwork(): void {
        VisNetwork.nodes = this.extractNodes();
        VisNetwork.edges = this.extractEdges();

        VisNetwork.groups = Object.fromEntries([...new Set<string>(VisNetwork.nodes.map((node: any) => node.group)).values()].map((group) => [group, produceGroup(group)]));

        VisNetwork.network = new Network(
            this.container.current!,
            { nodes: VisNetwork.nodes, edges: VisNetwork.edges },
            {
                physics: {
                    solver: 'hierarchicalRepulsion',
                    hierarchicalRepulsion: {
                        nodeDistance: 200,
                        damping: 0.15,
                    },
                },
                interaction: { hover: true },
                edges: {
                    smooth: false,
                    color: color.secondary,
                    chosen: false,
                    font: {
                        color: color.secondary,
                        background: color.background,
                        strokeWidth: 0,
                    },
                    arrowStrikethrough: false,
                },
                nodes: {
                    color: color.secondary,
                    font: {
                        color: color.primary,
                        background: color.background,
                    },
                },
                groups: VisNetwork.groups,
            }
        );
        VisNetwork.network.on('click', (e) => this.props.resourceSelected(e.nodes[0]));
    }

    private extractNodes(): DataView<any> {
        return new DataView(new DataSet(this.props.scanOutput.resources.map(produceNode)), {
            filter: (node) => (this.props.withDiff || node.diff == null) && everyIncludes(this.props.selectedTags, node.tags),
        });
    }

    private extractEdges(): DataView<any> {
        const edges: Record<string, any> = {};
        for (const resource of this.props.scanOutput.resources) {
            for (const relationship of resource.relationships ?? []) {
                const id = produceEdgeId(resource.id, relationship.resourceId);
                edges[id] ??= produceEdge(resource, relationship);
                enrichEdgeWithRelationship(edges[id], relationship);
            }
        }
        Object.values(edges).forEach(enrichEdgeForVis);

        return new DataView(new DataSet(Object.values(edges), {}), {
            filter: (edge) => this.props.withDiff || edge.diff == null,
        });
    }

    public override componentDidMount(): void {
        this.produceNetwork();
    }

    public override componentDidUpdate(prevProps: VisNetworkProps): void {
        if (!VisNetwork.network) return;

        if (prevProps.selectedResourceId !== this.props.selectedResourceId) {
            if (prevProps.selectedResourceId != null && VisNetwork.nodes.get(prevProps.selectedResourceId)) {
                for (const edge of VisNetwork.network.getConnectedEdges(prevProps.selectedResourceId)) {
                    VisNetwork.network.updateEdge(edge, { width: edgeWidth.default });
                }
            }

            if (this.props.selectedResourceId != null) {
                for (const edge of VisNetwork.network.getConnectedEdges(this.props.selectedResourceId)) {
                    VisNetwork.network.updateEdge(edge, { width: edgeWidth.selected });
                }
                VisNetwork.network.focus(this.props.selectedResourceId, {
                    animation: true,
                    scale: 1,
                });
            }
        }

        VisNetwork.nodes.refresh();
        VisNetwork.edges.refresh();
    }

    public override render() {
        return <div ref={this.container} className="w-full h-full" />;
    }
}

function produceNode(resource: ResourceExtended): Node {
    return {
        id: resource.id,
        label: resource.name ?? resource.id,
        group: resource.type ?? resource.source,
        tags: (resource.tags ?? []) as any,
        diff: resource.diff,
        font: {
            background: resource.diff ? color.diff[resource.diff] : undefined,
        } as any,
    };
}

function produceEdge(resource: ResourceExtended, relationship: RelationshipExtended): Edge {
    return {
        id: produceEdgeId(resource.id, relationship.resourceId),
        from: resource.id,
        to: relationship.resourceId,
        arrowFrom: !!relationship.from,
        arrowTo: !!relationship.to,
        labels: relationship.action ? new Set<string>([relationship.action]) : new Set<string>(),
        diff: relationship.diff ?? resource.diff,
        color: produceEdgeColor(resource.diff, relationship.diff),
    };
}

function produceEdgeId(resourceId: string, relationshipResourceId: string) {
    return [resourceId, relationshipResourceId].sort().join(',');
}

function enrichEdgeWithRelationship(edge: Edge, relationship: RelationshipExtended) {
    if (relationship.action) edge.labels.add(relationship.action);
    edge.arrowFrom ||= !!relationship.from;
    edge.arrowTo ||= !!relationship.to;
}

function enrichEdgeForVis(edge: Edge) {
    edge.label = [...edge.labels].join('\n');
    edge.arrows = [edge.arrowFrom && 'from', edge.arrowTo && 'to'].filter(Boolean).join(', ');
}

function produceGroup(group: string): { id: string; shape: string; image: string } {
    return {
        id: group,
        shape: 'image',
        image: getTypeImagePath(group),
    };
}

function produceEdgeColor(resourceDiff: Diff | undefined, relationshipDiff: Diff | undefined) {
    return resourceDiff ?? relationshipDiff ? color.diff[resourceDiff ?? relationshipDiff!] : undefined;
}
