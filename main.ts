/*  IMPORT BLOCK    */
// system
import * as assert from 'assert';
// read in files
import * as fs from 'fs';
// used to read in lines from the terminal, might use a front-end someday
import * as readline from 'readline-sync';
import { askRepeat, askRepeatMultiple } from './helpers/queries'
import { findTabLevel, insertTabs } from './helpers/tabs'
import { colors } from './helpers/coloredText'
// get version from package.json
const version = JSON.parse(fs.readFileSync('package.json').toString()).version;
// get variable prefix from config
const prefix = JSON.parse(fs.readFileSync('pteEasyFillConfig.json').toString()).prefix;

/*  WELCOME BLOCK   */
console.log(`${colors.Bright}${colors.Underscore}PTE Easy Filler v${version} by Arjun Srivastav${colors.Reset}
I'm open source!: https://github.com/sriRacha21/PTEEasyFiller/

${colors.Underscore}Tips:${colors.Reset}
* Prompts that require input will ask for input repeatedly until it receives an empty string and be displayed in ${colors.FgRed}red${colors.Reset}.
* When a prompt presents a string in parentheses it means that string will be used when an empty string is entered (essentially a default option).

    * Questions with a default answer will be displayed in ${colors.FgCyan}cyan${colors.Reset}.
* Press CTRL-C at any time to exit.
`);

/*  REQUEST BLOCK   */
// ask for template location (default to template.txt)
const maybeTemplateLocation: string = readline.question(`${colors.FgCyan}What is the filename of the template you are using? (template.txt): ${colors.Reset}`);
// read in template
const templateLocation: string = maybeTemplateLocation.length > 0 ? maybeTemplateLocation : "template.txt";
let template: string;
try {
    template = fs.readFileSync(templateLocation).toString()
} catch( err ) {
    console.log(`${templateLocation} could not be found!\nStacktrace: ${err}`);
    process.exit(1);
}
console.log(`PTE template located at ${templateLocation} has been found and successfully loaded!`);
/*  declare all needed variables to fill template   */
// ask for name
const name: string = askRepeat("\nWhat is your name?: ");
// ask for PTE name
const pteName: string = askRepeat("\nPTE Name?: ");
// ask for name of new Java file
let javaFilename: string = askRepeat("\nJava filename? Ensure your input is a valid Java filename: ", /^[^*&%\.\s]+(?:\.java)?$/i);
const className = javaFilename;
javaFilename += javaFilename.endsWith('.java') ? '' : '.java';
// ask for PTE ID
const pteID: number = +askRepeat("\nPTE ID?: ",/[0-9]+/);
// ask for possible questions
const possibleQuestions: string[] = askRepeatMultiple( n => `Possible Question ${n}?: ` );
// ask for variable names
const varNames: string[] = askRepeatMultiple( n => `Variable name ${n}?: `, /[^*&%\.\s]*/i );
// ask for variable types
const varTypes: string[] = askRepeatMultiple( n => `Variable ${n}'s type?: `, null, varNames.length );
assert(varNames.length == varTypes.length, "Variable names and types are supposed to be the same length");

/*  INPUT CLEANING BLOCK    */
// prepare question generation block
let questionBlock = `int questionSelection = rand.nextInt(${possibleQuestions.length});

switch( questionSelection ) {
`;
possibleQuestions.forEach( (possibleQuestion,idx) => questionBlock += `\tcase ${idx}: question = "${possibleQuestion}"; break;\n` );
questionBlock += '}\n';
questionBlock = insertTabs( questionBlock, findTabLevel(template,`${prefix}question`) );
// collate names and types
interface Variable {
    name: string;
    type: string;
}
const variables: Variable[] = varNames.map( (name,idx) => {
    return {
        name: name,
        type: varTypes[idx]
    }
});

/*  REPLACEMENT BLOCK */
// construct varNames as replacement string
let replacementVarNames = "";
// perform actual replacement and write
const templateWithReplacements = template
    .replace(`${prefix}pteID`, pteID.toString())
    .replace(`${prefix}pteName`, pteName)
    .replace(`${prefix}name`, name)
    .replace(`${prefix}className`, className)
    .replace(`${prefix}question`, questionBlock)
    .replace(`${prefix}vars`,variables
        .map(v => `${v.type} ${v.name};`)
        .join(`\n${'\t'.repeat(findTabLevel(template, `${prefix}vars`))}`)
    )
    .replace(`${prefix}distractorVars`,variables
        .map(v => `dataMap.put("${v.name} ", ${v.name})`)
        .join(`\n${'\t'.repeat(findTabLevel(template, `${prefix}distractorVars`))}`)
    )
fs.writeFileSync(`output/${javaFilename}`,templateWithReplacements);