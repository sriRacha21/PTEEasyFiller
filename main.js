// read in files
const fs = require('fs');
// used to read in lines from the terminal, might use a front-end someday
// TODO switch to readline-sync
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// ask for template location (default to template.txt)
rl.question("What is the filename of the template you are using? (template.txt): ", templateLocation => {

});
// read in template
let template
try {
    template = fs.readFileSync("template.txt").toString()
} catch( err ) {
    console.log(`template.txt could not be found! Make sure a file called template.txt exists in this directory.\nStacktrace: ${err}`);
    rl.close();
    return;
}
console.log(`Got template ${template}`);
// declare all needed variables to fill template
// ask for name
rl.question("What is your name? This will be used to fill in the author field: ", name => {

});
// ask for PTE name
// ask for PTE ID
// ask for 