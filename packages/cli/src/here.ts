export function here() {
    try {
        console.log("In here")
    } catch (error) {
        console.error("Error occurred while reading the directory!", error);
    }
}
