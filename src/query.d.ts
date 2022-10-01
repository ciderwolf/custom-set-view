export function parse(input: string, options: object = {}): object[];

export class SyntaxError extends Error {
    message: string;
    expected: object[];
    found: object;
    location: {
        start: object;
        end: object;
    };
    name: string;
}
