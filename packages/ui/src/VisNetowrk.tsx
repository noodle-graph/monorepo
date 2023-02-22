import React from 'react';
import { DataSet, DataView } from 'vis-data';
import { Network } from 'vis-network';

export interface Relationship {
    resourceId: string;
    action: string;
    tags: string[];
    url: string;
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
        new Network(
            this.container.current!,
            { nodes: this.nodes, edges: this.edges },
            {
                edges: {
                    smooth: false,
                    color: '#fef9c3',
                },
                nodes: {
                    color: '#94a3b8',
                    font: {
                        color: '#080d17',
                    },
                },
                groups: {
                    'aws/ecs': {},
                    'aws/ec2': {},
                    'aws/s3': {},
                },
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
                    tags: resource.tags?.join(','),
                }))
            ),
            {
                filter: (node) => this.props.selectedTags.length === 0 || this.props.selectedTags.every((tag) => node.tags?.split(',').includes(tag)),
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
                            arrows: 'to',
                            relation: relationship.action,
                        })) ?? []
                )
            ),
            {}
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
