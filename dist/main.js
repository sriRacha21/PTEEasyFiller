"use strict";
exports.__esModule = true;
// read in files
var fs = require("fs");
// used to read in lines from the terminal, might use a front-end someday
var readline = require("readline-sync");
var queries_1 = require("./helpers/queries");
var coloredText_1 = require("./helpers/coloredText");
// get version from package.json
var version = JSON.parse(fs.readFileSync('package.json').toString()).version;
// send welcome text
console.log("" + coloredText_1.colors.Bright + coloredText_1.colors.Underscore + "PTE Easy Filler v" + version + " by Arjun Srivastav" + coloredText_1.colors.Reset + "\nI'm open source!: https://github.com/sriRacha21/PTEEasyFiller/\n\n" + coloredText_1.colors.Underscore + "Tips:" + coloredText_1.colors.Reset + "\n* Prompts that require input will ask for input repeatedly until it receives a non-empty string and be displayed in " + coloredText_1.colors.FgRed + "red" + coloredText_1.colors.Reset + ".\n* When a prompt presents a string in parentheses it means that string will be used when an empty string is entered (essentially a default option).\n    * Questions with a default answer will be displayed in " + coloredText_1.colors.FgCyan + "cyan" + coloredText_1.colors.Reset + ".\n* Press CTRL-C at any time to exit.\n");
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
}
console.log("PTE template located at " + templateLocation + " has been found and successfully loaded!");
// declare all needed variables to fill template
// ask for name
var name = queries_1.askRepeat("\nWhat is your name?: ");
// ask for PTE name
var pteName = queries_1.askRepeat("\nPTE Name?: ");
// ask for name of new Java file
var javaFilename = queries_1.askRepeat("\nJava filename? Ensure your input is a valid Java filename: ", /^[^*&%\.\s]+(?:\.java)?$/i);
javaFilename += javaFilename.endsWith('.java') ? '' : '.java';
// ask for PTE ID
var pteID = +queries_1.askRepeat("\nPTE ID?: ", /[0-9]+/);
// ask for variable names
var varNames = queries_1.askRepeatMultiple(function (n) { return "Variable " + n + "?: "; }, /[^*&%\.\s]*/i);
console.log("varNames: " + varNames);
//# sourceMappingURL=main.js.map