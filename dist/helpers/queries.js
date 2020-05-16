"use strict";
exports.__esModule = true;
var readline = require("readline-sync");
var coloredText_1 = require("./coloredText");
// repeatedly ask for input on empty string received or no regex match
function askRepeat(question, regex, blankCheck) {
    if (blankCheck === void 0) { blankCheck = true; }
    var input;
    var isMatch;
    do {
        // re-init values
        input = readline.question("" + coloredText_1.colors.FgRed + question + coloredText_1.colors.Reset);
        isMatch = regex ? regex.test(input) : true;
        // user-readable reason for why they are being re-asked
        if (input == "" && blankCheck)
            console.log("This is a required field! Re-asking...");
        if (!isMatch)
            console.log("Invalid input!");
        // re-ask
    } while ((input == "" && blankCheck) || !isMatch);
    return input;
}
exports.askRepeat = askRepeat;
// repeatedly ask for separate fields until there is an empty string
// one of the params is a builder that decides where the number will be inserted in the question
function askRepeatMultiple(questionBuilder, regex, count) {
    // insert an empty line in terminal
    console.log('');
    var responses = [];
    var i = 0;
    var input;
    do {
        // break if the count arg is used and the count is reached
        if (!!count && i >= count)
            break;
        var question = questionBuilder(++i);
        input = askRepeat(question, regex, false);
        if (input != "")
            responses.push(input);
    } while (input != "");
    return responses;
}
exports.askRepeatMultiple = askRepeatMultiple;
//# sourceMappingURL=queries.js.map