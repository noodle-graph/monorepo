export async function bundle(bundleAttributes) {
    try {
        //in the package json need to 'nx build ui && copy-files'
        // and copy all the files under the build folder in the ui to dist/uiBuild

        //the command should copy all files to the output folder given
        //change the %SCAN_OUTPUT_PLACEHOLDER% to the scan output files
        console.log(`In bundle ${JSON.stringify(bundleAttributes)}`)
        console.log("In bundle")
    } catch (error) {
        console.error("Error occurred while reading the directory!", error);
    }
}
