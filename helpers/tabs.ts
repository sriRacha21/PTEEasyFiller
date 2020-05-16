// takes file data and a string located on a line within that file and returns the number of tabs on that line
export function findTabLevel( fileData: string, lineContent: string ): number {
    const maybeLine = fileData
        .split('\n')
        .find(line => line.includes(lineContent));
    // guard clause for line existence
    if( !maybeLine ) {
        console.log(`Could not find line ${lineContent} in file.`);
        return 0;
    }
    
    return (maybeLine.match(new RegExp('\t','g')) || []).length
}

// function to take a string and insert tabs on every line but the first
export function insertTabs( input: string, tabCount: number ): string {
    return input
        .split('\n')
        .map((line,idx) => {
            if( idx > 0 ) return '\t'.repeat(tabCount) + line
            else return line; 
        })
        .join('\n');
}