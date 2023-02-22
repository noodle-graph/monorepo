import {writeFile} from 'fs';
import {Resource} from "../../types/src";

export function foo() {
    console.log('foo');
}

export async function writeToJSONFile(resourcesList: any) {
    const path = process.cwd() + '/scan_config_file.json';
    await new Promise((resolve) => writeFile(path, JSON.stringify(resourcesList, null, 2), resolve));
}

const resourceList: Resource[] = [
    {
        id: "test_id",
        type: "test_type",
        name: "test_name",
        tags: ["tag1", "tag2"],
        relationships: [{resourceId: "test_resourceId", action: "test_action", url:"https://test.url/test", tags: ["tag3", "tag4"]}],
    }
]
writeToJSONFile(resourceList);
