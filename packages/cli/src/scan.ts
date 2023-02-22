// import { scan_config } from "@noodle-graph/scanner";
import { promises as fs } from 'fs';

export async function scan(scanAttributes) {
    try {
        console.log(`In scan ${JSON.stringify(scanAttributes)}`);
        console.log(`In scan ${JSON.stringify(scanAttributes.C)}`);
        console.log(`In scan ${JSON.stringify(scanAttributes.O)}`);

        // scan_config(scanAttributes.C,scanAttributes.O + '/scanResult.json', scanAttributes.githubToken)

        await fs.cp(__dirname + '/uiBuild', scanAttributes.O, { recursive: true });

        const scanOutput = await fs.readFile(scanAttributes.O + '/scanResult.json', 'utf8');
        let fileUiInput = await fs.readFile(scanAttributes.O + '/scanOutput.js', 'utf8');
        fileUiInput = fileUiInput.replace('%SCAN_OUTPUT_PLACEHOLDER%', scanOutput);
        await fs.writeFile(scanAttributes.O + '/scanOutput.js', fileUiInput, { encoding: 'utf8' });
    } catch (error) {
        console.error('Error occurred while reading the directory!', error);
    }
}
