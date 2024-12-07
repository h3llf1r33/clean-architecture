export const jsonpath = require('jsonpath');

type ArrayElementPaths<T> = T extends any
    ? T extends object
        ? ObjectPaths<T>
        : never
    : never;

type ObjectPaths<T> = T extends object
    ? {
        [P in keyof T]-?: 
            | `['${P & string}']`
            | (T[P] extends Array<infer U>
                ? `['${P & string}'][*]` | `['${P & string}'][*]${ArrayElementPaths<U>}`
                : T[P] extends object | undefined
                    ? `['${P & string}']${ObjectPaths<NonNullable<T[P]>>}`
                    : never)
    }[keyof T]
    : never;

type JsonPath<T> = `$${ObjectPaths<T>}`;

export type DataMirror<Input, Output> = {
    [K in keyof Output]: JsonPath<Input> | string | ((input: Input) => Output[K] | string);
};
 
 function hasCircular(obj: any): boolean {
    const seen = new WeakSet();
    const detect = (obj: any): boolean => {
        if (obj && typeof obj === 'object') {
            if (seen.has(obj)) return true;
            seen.add(obj);
            return Object.values(obj).some(detect);
        }
        return false;
    };
    return detect(obj);
}

export function reflect<Input, Output>(mapping: DataMirror<Input, Output>, input: Input): Output {
    return Object.entries(mapping).reduce((result, [key, extractor]) => {
        // For functions, just use the result directly
        if (typeof extractor === 'function') {
            return {
                ...result,
                [key]: (extractor as (input: Input) => Output[keyof Output])(input)
            };
        }
 
        // For JSONPath
        // Use value() for single path lookups without wildcards/filters
        if (typeof extractor === "string" && !extractor.includes('*') && !extractor.includes('?') && !extractor.includes('..')) {
            const value = jsonpath.value(input, extractor);
            
            if (value && typeof value === 'object' && hasCircular(value)) {
                throw new Error('Circular data structure detected.');
            }
 
            return {
                ...result,
                [key]: value
            };
        }
 
        // Use query() for wildcards/filters/recursive queries
        const value = jsonpath.query(input, extractor);
        
        if (value && Array.isArray(value) && value.some(hasCircular)) {
            throw new Error('Circular data structure detected.');
        }
 
        return {
            ...result,
            [key]: value
        };
    }, {} as Output);
 }