import React from 'react';
import { DataSet, DataView } from 'vis-data';
import { Network } from 'vis-network';

const IMG_DIR = 'img/';

export interface Relationship {
    resourceId: string;
    action: string;
    tags: string[];
    url: string;
    direction: 'none' | 'from' | 'to' | 'both';
}

export interface Resource {
    id: string;
    name?: string;
    type?: string;
    tags?: string[];
    url?: string;
    relationships?: Relationship[];
}

export interface VisNetworkProps {
    scanOutput: {
        resources: Resource[];
    };
    selectedTags: string[];
    selectNode: (nodeId: string) => void;
}

export class VisNetwork extends React.Component<VisNetworkProps> {
    private container = React.createRef<HTMLDivElement>();
    private edges: any;
    private nodes: any;

    constructor(props: VisNetworkProps) {
        super(props);
    }

    private produceNetwork(): void {
        this.nodes = this.extractNodes();
        this.edges = this.extractEdges();

        let i = 0;
        // eslint-disable-next-line node/no-unsupported-features/es-builtins
        const groups = Object.fromEntries(
            [...new Set(this.nodes.map((node: any) => node.group)).values()].map((group) => [
                group,
                {
                    id: i++,
                    shape: 'image',
                    image: IMG_DIR + group + '.svg',
                },
            ])
        );

        new Network(
            this.container.current!,
            { nodes: this.nodes, edges: this.edges },
            {
                edges: {
                    smooth: false,
                    color: '#f1f5f9',
                    chosen: false,
                    font: {
                        color: '#94a3b8',
                        background: '#1e293b',
                        strokeWidth: 0,
                    },
                    length: 250,
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
        ).on('click', (e) => {
            this.props.selectNode(e.nodes[0]);
        });
    }

    private extractNodes() {
        return new DataView(
            new DataSet(
                this.props.scanOutput.resources.map((resource: Resource) => ({
                    id: resource.id,
                    label: resource.name ?? resource.id,
                    group: resource.type,
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

        return new DataView(
            new DataSet(
                this.props.scanOutput.resources.flatMap(
                    (resource: Resource) =>
                        resource.relationships?.map((relationship: Relationship) => ({
                            id: i++,
                            from: resource.id,
                            to: relationship.resourceId,
                            arrows: relationship.direction === 'both' ? 'from, to' : relationship.direction === 'none' ? undefined : relationship.direction,
                            label: relationship.action,
                        })) ?? []
                ),
                {}
            )
        );
    }

    override componentDidMount(): void {
        this.produceNetwork();
    }

    override componentDidUpdate(): void {
        this.nodes.refresh();
    }

    override render() {
        return <div ref={this.container} className="w-full h-full" />;
    }
}
