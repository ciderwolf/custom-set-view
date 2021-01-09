export function parse(input: string, options: object = {}): object[];

export class SyntaxError {
    message: string;
    expected: object[];
    found: object;
    location: {
        start: object;
        end: object;
    };
    name: string;
}
