"use strict";
exports.__esModule = true;
/*  IMPORT BLOCK    */
// system
var assert = require("assert");
// read in files
var fs = require("fs");
// used to read in lines from the terminal, might use a front-end someday
var readline = require("readline-sync");
var queries_1 = require("./helpers/queries");
var tabs_1 = require("./helpers/tabs");
var coloredText_1 = require("./helpers/coloredText");
// get version from package.json
var version = JSON.parse(fs.readFileSync('package.json').toString()).version;
// get variable prefix from config
var prefix = JSON.parse(fs.readFileSync('pteEasyFillConfig.json').toString()).prefix;
/*  WELCOME BLOCK   */
console.log("" + coloredText_1.colors.Bright + coloredText_1.colors.Underscore + "PTE Easy Filler v" + version + " by Arjun Srivastav" + coloredText_1.colors.Reset + "\nI'm open source!: https://github.com/sriRacha21/PTEEasyFiller/\n\n" + coloredText_1.colors.Underscore + "Tips:" + coloredText_1.colors.Reset + "\n* Prompts that require input will ask for input repeatedly until it receives an empty string and be displayed in " + coloredText_1.colors.FgRed + "red" + coloredText_1.colors.Reset + ".\n* When a prompt presents a string in parentheses it means that string will be used when an empty string is entered (essentially a default option).\n\n    * Questions with a default answer will be displayed in " + coloredText_1.colors.FgCyan + "cyan" + coloredText_1.colors.Reset + ".\n* Press CTRL-C at any time to exit.\n");
/*  REQUEST BLOCK   */
// ask for template location (default to template.txt)
var maybeTemplateLocation = readline.question(coloredText_1.colors.FgCyan + "What is the filename of the template you are using? (template.txt): " + coloredText_1.colors.Reset);
// read in template
var templateLocation = maybeTemplateLocation.length > 0 ? maybeTemplateLocation : "template.txt";
var template;
try {
    template = fs.readFileSync(templateLocation).toString();
}
catch (err) {
    console.log(templateLocation + " could not be found!\nStacktrace: " + err);
    process.exit(1);
}
console.log("PTE template located at " + templateLocation + " has been found and successfully loaded!");
/*  declare all needed variables to fill template   */
// ask for name
var name = queries_1.askRepeat("\nWhat is your name?: ");
// ask for PTE name
var pteName = queries_1.askRepeat("\nPTE Name?: ");
// ask for name of new Java file
var javaFilename = queries_1.askRepeat("\nJava filename? Ensure your input is a valid Java filename: ", /^[^*&%\.\s]+(?:\.java)?$/i);
var className = javaFilename;
javaFilename += javaFilename.endsWith('.java') ? '' : '.java';
// ask for PTE ID
var pteID = +queries_1.askRepeat("\nPTE ID?: ", /[0-9]+/);
// ask for possible questions
var possibleQuestions = queries_1.askRepeatMultiple(function (n) { return "Possible Question " + n + "?: "; });
// ask for variable names
var varNames = queries_1.askRepeatMultiple(function (n) { return "Variable name " + n + "?: "; }, /[^*&%\.\s]*/i);
// ask for variable types
var varTypes = queries_1.askRepeatMultiple(function (n) { return "Variable " + n + "'s type?: "; }, null, varNames.length);
assert(varNames.length == varTypes.length, "Variable names and types are supposed to be the same length");
/*  INPUT CLEANING BLOCK    */
// prepare question generation block
var questionBlock = "int questionSelection = rand.nextInt(" + possibleQuestions.length + ");\n\nswitch( questionSelection ) {\n";
possibleQuestions.forEach(function (possibleQuestion, idx) { return questionBlock += "\tcase " + idx + ": question = \"" + possibleQuestion + "\"; break;\n"; });
questionBlock += '}\n';
questionBlock = tabs_1.insertTabs(questionBlock, tabs_1.findTabLevel(template, prefix + "question"));
var variables = varNames.map(function (name, idx) {
    return {
        name: name,
        type: varTypes[idx]
    };
});
/*  REPLACEMENT BLOCK */
// construct varNames as replacement string
var replacementVarNames = "";
// perform actual replacement and write
var templateWithReplacements = template
    .replace(prefix + "pteID", pteID.toString())
    .replace(prefix + "pteName", pteName)
    .replace(prefix + "name", name)
    .replace(prefix + "className", className)
    .replace(prefix + "question", questionBlock)
    .replace(prefix + "vars", variables
    .map(function (v) { return v.type + " " + v.name + ";"; })
    .join("\n" + '\t'.repeat(tabs_1.findTabLevel(template, prefix + "vars"))))
    .replace(prefix + "distractorVars", variables
    .map(function (v) { return "dataMap.put(\"" + v.name + " \", " + v.name + ")"; })
    .join("\n" + '\t'.repeat(tabs_1.findTabLevel(template, prefix + "distractorVars"))));
fs.writeFileSync("output/" + javaFilename, templateWithReplacements);
//# sourceMappingURL=main.js.map