import * as readline from 'readline-sync';
import { colors } from './coloredText'
import { Dictionary } from '../main'

// repeatedly ask for input on empty string received or no regex match
export function askRepeat( question: string, regex?: RegExp, blankCheck = true ): string {
    if( blankCheck ) console.log('');

    let input: string;
    let isMatch: boolean; 
    do {
        // re-init values
        input = readline.question(`${colors.FgRed}${question}${colors.Reset} `); 
        isMatch = regex ? regex.test(input) : true;
        
        // user-readable reason for why they are being re-asked
        if( input == "" && blankCheck ) console.log("This is a required field! Re-asking...");
        if( !isMatch ) console.log("Invalid input!");
        // re-ask
    } while( (input == "" && blankCheck) || !isMatch );
    return input;
}

// ask question with a default option, if regex no match and re-ask
export function askDefault( question: string, defaultOption: string, regex?: RegExp, repeat = false ): string {
    if( !repeat ) console.log('');
    // if the default option doesn't match the regex it should not be presented as a default.
    if( regex && !regex.test(defaultOption) )
        return askRepeat( question, regex );

    // otherwise, use the default option and re-ask if the regex doesn't match
    let maybeInput: string;
    let isMatch: boolean;
    do {
        // re-init values
        maybeInput = readline.question(`${colors.FgCyan}${question} (${defaultOption == "" ? "nothing" : defaultOption}) ${colors.Reset}`)
        maybeInput = maybeInput.length > 0 ? maybeInput : defaultOption;
        isMatch = regex ? regex.test(maybeInput) : true;
        // tell user why they are being re-asked
        if( !isMatch ) console.log( "Invalid input!" );
    } while( !isMatch ); 
    return maybeInput;
}

// repeatedly ask for separate fields until there is an empty string
// one of the params is a builder that decides where the number will be inserted in the question
export function askRepeatMultiple( questionBuilder: (questionNumber: number) => string, regex?: RegExp, count?: number, defaultOption?: string ): string[] {
    console.log('');

    const responses: string[] = [];
    
    let i: number = 0;
    let input: string;
    do {
        // break if the count arg is used and the count is reached
        if( !!count && i >= count ) break;

        const question: string = questionBuilder(++i);
        if( defaultOption ) input = askDefault( question, defaultOption, regex, true );
        else input = askRepeat(question, regex, false);
        if( input != "" ) responses.push(input);
    } while( input != "" );

    return responses;
}

// ask a question, presenting some options
export function askOptions( question: string, options: Dictionary<string> ): string {
    let constructedQuestion = question + " (";
    let questionOptions: string[] = [];
    let strOptions: string[] = [];
    for( const option in options ) {
        questionOptions.push(`${option} = "${options[option]}"`);
        strOptions.push(option);
    }
    constructedQuestion += questionOptions.join(", ") + ")";

    let constructedRegex = strOptions.join("|");

    return askRepeat( constructedQuestion, new RegExp(constructedRegex), false );
}