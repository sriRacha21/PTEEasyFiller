"use strict";
exports.__esModule = true;
// takes file data and a string located on a line within that file and returns the number of tabs on that line
function findTabLevel(fileData, lineContent) {
    var maybeLine = fileData
        .split('\n')
        .find(function (line) { return line.includes(lineContent); });
    // guard clause for line existence
    if (!maybeLine) {
        console.log("Could not find line " + lineContent + " in file.");
        return 0;
    }
    return (maybeLine.match(new RegExp('\t', 'g')) || []).length;
}
exports.findTabLevel = findTabLevel;
// function to take a string and insert tabs on every line but the first
function insertTabs(input, tabCount) {
    return input
        .split('\n')
        .map(function (line, idx) {
        if (idx > 0)
            return '\t'.repeat(tabCount) + line;
        else
            return line;
    })
        .join('\n');
}
exports.insertTabs = insertTabs;
//# sourceMappingURL=tabs.js.map