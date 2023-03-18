import type { Resource } from '@noodle-graph/types';

import { ResourceAlreadyExistError } from './errors';
import type { ResourceExtended, ScanResultExtended, SelectOption, FilterOption } from './types';

class ScanOutputStore {
    // If there is any performance issue, we can store the resources as object instead of array.
    private firstScanOutput: ScanResultExtended = { resources: [] };
    private _scanOutput: ScanResultExtended = { resources: [] };

    public get scanOutput(): ScanResultExtended {
        return this._scanOutput;
    }

    public download(): void {
        const blob = new Blob([JSON.stringify(this._scanOutput)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'noodle-scan-output.json';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    public import(): Promise<void> {
        return new Promise((resolve) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.addEventListener('change', ({ target }: Event) => {
                const file = (target as HTMLInputElement)?.files?.[0];
                if (!file) {
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result == null) return;
                    this.setScanOutput(JSON.parse(e.target.result.toString()));
                    this.enrichDiff();
                    resolve();
                };
                reader.readAsText(file);
            });
            input.click();
        });
    }

    private enrichDiff(): void {
        for (const resource of this._scanOutput.resources) {
            const originalResource = this.firstScanOutput.resources.find((r) => r.id === resource.id);
            if (!originalResource) resource.diff = '+';
            for (const relationship of resource.relationships ?? []) {
                // XXX: The result is not exact when there are more than one relationship per resource.
                if (originalResource?.relationships?.every((r) => r.resourceId !== relationship.resourceId)) {
                    relationship.diff = '+';
                }
            }
        }

        for (const originalResource of this.firstScanOutput.resources) {
            const resource = this._scanOutput.resources.find((r) => r.id === originalResource.id);
            if (!resource) {
                this._scanOutput.resources.push({ ...originalResource, diff: '-' });
            }
            for (const originalRelationship of originalResource.relationships ?? []) {
                // XXX: The result is not exact when there are more than one relationship per resource.
                if (resource?.relationships?.every((r) => r.resourceId !== originalRelationship.resourceId)) {
                    resource.relationships.push({ ...originalRelationship, diff: '-' });
                }
            }
        }
    }

    public async importBundledScanOutput() {
        const response = await fetch('scanOutput.json');

        try {
            this.setScanOutput(await response.json());
            this.firstScanOutput = JSON.parse(JSON.stringify(this._scanOutput));
        } catch {
            console.warn('Using unbundled UI');
            return;
        }
    }

    public addResource(resource: Resource) {
        if (this._scanOutput.resources.some((r) => r.id === resource.id)) throw new ResourceAlreadyExistError();

        const newResource: ResourceExtended = { ...resource, source: 'ui', diff: '+' };
        this.enrichResource(newResource, this._scanOutput);
        this._scanOutput.resources.push(newResource);
    }

    public removeResource(resourceId: string) {
        const resource = this._scanOutput.resources.find((r) => r.id === resourceId);
        if (resource) resource.diff = '-';
    }

    private setScanOutput(scanOutputNew: ScanResultExtended) {
        for (const resource of scanOutputNew.resources) {
            this.enrichResource(resource, scanOutputNew);
        }
        this._scanOutput = scanOutputNew;
    }

    private enrichResource(resource: ResourceExtended, scanResultExtended: ScanResultExtended) {
        for (const relationship of resource.relationships ?? []) {
            relationship.resource = {
                ...scanResultExtended.resources.find((r: Resource) => r.id === relationship.resourceId)!,
                relationships: undefined,
            };
        }
    }

    public extractTagOptions(): FilterOption<string>[] {
        return [...new Set<string>(this._scanOutput.resources.flatMap((resource: ResourceExtended) => resource.tags ?? []))].map((tag: string) => ({
            key: tag,
            value: tag,
            display: tag,
            selected: false,
        }));
    }

    public extractResourceOptions(): SelectOption<string>[] {
        return this._scanOutput.resources.map((resource) => ({
            key: resource.id,
            value: resource.id,
            display: resource.name ?? resource.id,
        }));
    }
}

export const scanOutputStore = new ScanOutputStore();
