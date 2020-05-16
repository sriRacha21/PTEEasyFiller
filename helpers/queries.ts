import * as readline from 'readline-sync';
import { colors } from './coloredText'

// repeatedly ask for input on empty string received or no regex match
export function askRepeat( question: string, regex?: RegExp, blankCheck = true ): string {
    let input: string;
    let isMatch: boolean; 
    do {
        // re-init values
        input = readline.question(`${colors.FgRed}${question}${colors.Reset}`); 
        isMatch = regex ? regex.test(input) : true;
        
        // user-readable reason for why they are being re-asked
        if( input == "" && blankCheck ) console.log("This is a required field! Re-asking...");
        if( !isMatch ) console.log("Invalid input!");
        // re-ask
    } while( (input == "" && blankCheck) || !isMatch );
    return input;
}

// repeatedly ask for separate fields until there is an empty string
// one of the params is a builder that decides where the number will be inserted in the question
export function askRepeatMultiple( questionBuilder: (questionNumber: number) => string, regex?: RegExp, count?: number ): string[] {
    // insert an empty line in terminal
    console.log('');

    const responses: string[] = [];
    
    let i: number = 0;
    let input: string;
    do {
        // break if the count arg is used and the count is reached
        if( !!count && i >= count ) break;

        const question: string = questionBuilder(++i);
        input = askRepeat(question, regex, false);
        if( input != "" ) responses.push(input);
    } while( input != "" )

    return responses;
}