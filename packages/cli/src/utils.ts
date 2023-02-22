import figlet from 'figlet';

export async function printLogo() {
    const noodleEmoji = '🍜';
    const spaceForNoodle = ' '.repeat(82);
    console.log(' ' + noodleEmoji);
    console.log(figlet.textSync('Noodle-Graph CLI'));
    console.log(spaceForNoodle + noodleEmoji);
}
