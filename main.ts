// read in files
import * as fs from 'fs';
// used to read in lines from the terminal, might use a front-end someday
import * as readline from 'readline-sync';
import { askRepeat, askRepeatMultiple } from './helpers/queries'
import { colors } from './helpers/coloredText'
// get version from package.json
const version = JSON.parse(fs.readFileSync('package.json').toString()).version;

// send welcome text
console.log(`${colors.Bright}${colors.Underscore}PTE Easy Filler v${version} by Arjun Srivastav${colors.Reset}
I'm open source!: https://github.com/sriRacha21/PTEEasyFiller/

${colors.Underscore}Tips:${colors.Reset}
* Prompts that require input will ask for input repeatedly until it receives a non-empty string and be displayed in ${colors.FgRed}red${colors.Reset}.
* When a prompt presents a string in parentheses it means that string will be used when an empty string is entered (essentially a default option).
    * Questions with a default answer will be displayed in ${colors.FgCyan}cyan${colors.Reset}.
* Press CTRL-C at any time to exit.
`);
// ask for template location (default to template.txt)
const maybeTemplateLocation: string = readline.question(`${colors.FgCyan}What is the filename of the template you are using? (template.txt): ${colors.Reset}`);
// read in template
const templateLocation: string = maybeTemplateLocation.length > 0 ? maybeTemplateLocation : "template.txt";
let template: string;
try {
    template = fs.readFileSync(templateLocation).toString()
} catch( err ) {
    console.log(`${templateLocation} could not be found!\nStacktrace: ${err}`);
}
console.log(`PTE template located at ${templateLocation} has been found and successfully loaded!`);
// declare all needed variables to fill template
// ask for name
const name: string = askRepeat("\nWhat is your name?: ");
// ask for PTE name
const pteName: string = askRepeat("\nPTE Name?: ");
// ask for name of new Java file
let javaFilename: string = askRepeat("\nJava filename? Ensure your input is a valid Java filename: ", /^[^*&%\.\s]+(?:\.java)?$/i);
javaFilename += javaFilename.endsWith('.java') ? '' : '.java';
// ask for PTE ID
const pteID: number = +askRepeat("\nPTE ID?: ",/[0-9]+/);
// ask for variable names
const varNames: Array<String> = askRepeatMultiple( (n) => `Variable ${n}?: `, /[^*&%\.\s]*/i );

//
console.log("WIP!");