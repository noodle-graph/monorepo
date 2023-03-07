import type { NoodlePlugin, Resource } from '@noodle-graph/types';

export default class TypeGoogleLinker implements NoodlePlugin {
    public enrich(resources: Resource[]): Resource[] {
        for (const resource of resources) {
            if (resource.type) {
                resource.additionalLinks ??= [];
                resource.additionalLinks.push({
                    label: 'Search the type in google...',
                    url: `https://www.google.com/search?q=${encodeURIComponent(resource.type)}`,
                });
            }
        }
        return resources;
    }
}
