import type { Resource } from '@noodle-graph/types';

import { ResourceAlreadyExistError } from './errors';
import type { ResourceExtended, ScanResultExtended, SelectOption, FilterOption } from './types';

class ScanOutputStore {
    private _scanOutput: ScanResultExtended = { resources: [] };

    public get scanOutput(): ScanResultExtended {
        return { ...this._scanOutput };
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
                    resolve();
                };
                reader.readAsText(file);
            });
            input.click();
        });
    }

    public async importBundledScanOutput() {
        const response = await fetch('scanOutput.json');

        try {
            this.setScanOutput(await response.json());
        } catch {
            console.warn('Using unbundled UI');
            return;
        }
    }

    public addResource(resource: Resource) {
        if (this._scanOutput.resources.some((r) => r.id === resource.id)) throw new ResourceAlreadyExistError();

        const newResource: ResourceExtended = { ...resource, source: 'ui' };
        this.enrichResource(newResource, this._scanOutput);
        this._scanOutput.resources.push(newResource);
    }

    public removeResource(resourceId: string) {
        this._scanOutput.resources = this._scanOutput.resources.filter((r) => r.id !== resourceId);
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
