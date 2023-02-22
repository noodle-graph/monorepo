// import { scan_config } from "@noodle-graph/scanner";

export async function scan(scanAttributes) {
    try {
        console.log(`In scan ${JSON.stringify(scanAttributes)}`)
        // scan_config(scanAttributes.C,scanAttributes.O, scanAttributes.githubToken)
    } catch (error) {
        console.error("Error occurred while reading the directory!", error);
    }
}
