#!/usr/bin/env node
/*  IMPORT BLOCK    */
// system
import * as assert from 'assert';
// read in files
import * as fs from 'fs';
// used to read in lines from the terminal, might use a front-end someday
import * as readline from 'readline-sync';
import { askRepeat, askRepeatMultiple, askDefault, askOptions } from './helpers/queries'
import { findTabLevel, insertTabs } from './helpers/tabs'
import { colors } from './helpers/coloredText'
// get version from package.json
const version = JSON.parse(fs.readFileSync('package.json').toString()).version;
// get variable prefix from config
const pteConfig = JSON.parse(fs.readFileSync('pteEasyFillConfig.json').toString())
const prefix = pteConfig.prefix;
const defaultTemplateLocation = pteConfig.defaultTemplateLocation;

/*  INTERFACES  */
export interface Dictionary<T> {
    [key: string]: T;
}
interface Variable {
    name: string;
    type: string;
    generationMethod: string;
}
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
const templateLocation = askDefault( "What is the filename of the template you are using?", defaultTemplateLocation );
// read in template
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
const name: string = askRepeat("What is your name?:");
// ask for PTE name
const pteName: string = askRepeat("PTE Name?:");
// ask for name of new Java file
let javaFilename: string = askDefault("Java filename? Ensure your input is a valid Java filename:", pteName.endsWith('.java') ? pteName : `${pteName}.java`, /^[^*&%\.\s]+(?:\.java)?$/i);
const className = javaFilename.split('.java')[0];
// ask for PTE ID
const pteID: number = +askRepeat("PTE ID?:",/[0-9]+/);
// ask for variable names
const varNames: string[] = askRepeatMultiple( n => `Variable name ${n}?:`, /[^*&%\.\s]*/i );
// ask for variable types
const varTypes: string[] = askRepeatMultiple( n => `Variable ${n}'s type?:`, null, varNames.length, "SigfigNumber" );
assert(varNames.length == varTypes.length, "Variable names and types array are supposed to be the same length.");
// ask for answer type
const answerType : string = askDefault( "Answer type?:", "SigfigNumber" );
let answerSigfigs: number;
if( answerType == "SigfigNumber" ) answerSigfigs = +askRepeat("How many sigfigs does the answer have?:");
// ask how variables are generated
console.log('');
const generatedVars: string[] = [];
varTypes.forEach( (type,idx) => {
    if( type == "SigfigNumber" ) {
        generatedVars.push( askOptions(`How would you like to generate "${varNames[idx]}"?:`, {
            i: "in increments within range",
            r: "in range",
            s: "static"
        }) );
    } else {
        generatedVars.push("");
    }
})
// ask for possible questions
const possibleQuestions: string[] = askRepeatMultiple( n => `Possible Question ${n}?:` );

/*  INPUT CLEANING BLOCK    */
// collate names, types, and generation methods
const variables: Variable[] = varNames.map( (name,idx) => {
    return {
        name: name,
        type: varTypes[idx],
        generationMethod:  generatedVars[idx]
    }
});
// prepare question generation block
let questionBlock = `int questionSelection = rand.nextInt(${possibleQuestions.length});

switch( questionSelection ) {
`;
possibleQuestions.forEach( (possibleQuestion,idx) => questionBlock += `\tcase ${idx}: question = "${possibleQuestion}"; break;\n` );
questionBlock += '}\n';
questionBlock = insertTabs( questionBlock, findTabLevel(template,`${prefix}question`) );
// for each variable, replace each variable in the question with its variable name
variables.forEach( variable => {
    // if the question doesn't include the variable no replacement is needed
    if( !questionBlock.includes(`$${variable.name}`) ) return;
   
    let method = askDefault(`The variable "${variable.name}" was detected in the question. What method would you like to run on it?:`, "");
    method = method.startsWith('.') || method == "" ? method : `.${method}`;

    questionBlock = questionBlock.replace(new RegExp(`\\$${variable.name}`, 'g'),`" + ${variable.name}${method} + "`);
})
// prepare variable generation block
console.log('');
// TODO if the answer is not a sigfig ask for number of sigfigs
let generatedVarsBlock = "";
variables.forEach( variable => {
    if( variable.type == "SigfigNumber") {
        if( variable.generationMethod == "i" || variable.generationMethod == "r" ) {
            const [min, max] = askRepeat(`Enter the range of "${variable.name}" (min-max):`, /^[0-9]+(?:\.[0-9]+)?-[0-9]+(?:\.[0-9]+)?$/, false ).split('-');
            if( variable.generationMethod == "r" )
                generatedVarsBlock += `${variable.name} = SigfigNumber.random(${min}, ${max}, ${answerSigfigs});\n`;
            else if( variable.generationMethod == "i" ) {
                const increments = askRepeat(`Enter the increments for "${variable.name}":`, /^[0-9]+(?:\.[0-9]+)?$/, false);
                generatedVarsBlock += `${variable.name} = SigfigNumber.randomRangeIncrements(${min}, ${max}, ${increments});\n`;
            }
        } else if( variable.generationMethod == "s" ) {
            const value = askRepeat(`Enter the value for "${variable.name}":`, /^[0-9]+(?:\.[0-9]+)?$/, false);
            generatedVarsBlock += `${variable.name} = new SigfigNumber(${value}, ${answerSigfigs});\n`;
        }
    } else {
        const value = askRepeat(`Enter the value for "${variable.name}":`, null, false);
        generatedVarsBlock += `${variable.name} = ${value};\n`;
    }
})
generatedVarsBlock = insertTabs( generatedVarsBlock, findTabLevel(template, `${prefix}generatedVars`));

/*  REPLACEMENT BLOCK */
// perform actual replacement and write
const templateWithReplacements = template
    .replace(`${prefix}version`, version)
    .replace(`${prefix}pteID`, pteID.toString())
    .replace(`${prefix}pteName`, pteName)
    .replace(`${prefix}name`, name)
    .replace(`${prefix}className`, className)
    .replace(`${prefix}question`, questionBlock)
    .replace(`${prefix}vars`,variables
        .map(v => `${v.type} ${v.name};`)
        .join(`\n${'\t'.repeat(findTabLevel(template, `${prefix}vars`))}`)
    )
    .replace(`${prefix}versionVars`,variables
        .map(v => `dataMap.put("${v.name} ", ${v.name})`)
        .join(`\n${'\t'.repeat(findTabLevel(template, `${prefix}versionVars`))}`)
    )
    .replace(`${prefix}answerType`, answerType)
    .replace(`${prefix}generatedVars`, generatedVarsBlock);

fs.writeFile(`output/${javaFilename}`,templateWithReplacements, function (err) {
    if( err ) console.log(`\nError writing out file to output/${javaFilename}!: `, err);
    else console.log(`\nSuccessfully wrote out to output/${javaFilename}.`);
});