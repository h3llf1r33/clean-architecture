import jsonpath from 'jsonpath';


// Branded type to differentiate custom strings
type CustomJsonPath = string & { __brand?: 'CustomJsonPath' };

// JSONPath for strongly-typed object paths
type ArrayIndex = `[${number}]`;
type ArraySlice = `[${number}:${number}]` | '[*]' | `[${number}:]` | `[:${number}]`;
type ArrayAccess = ArrayIndex | ArraySlice;

type PathPart<T> = T extends Array<infer U>
    ? ArrayAccess
    : keyof T & string;

type RecursivePath<T> = T extends Array<infer U>
    ? `${ArrayAccess}${RecursivePath<U>}` | ArrayAccess
    : T extends object
        ? {
              [K in keyof T & string]: `['${K}']${RecursivePath<T[K]>}` | `['${K}']`;
          }[keyof T & string]
        : '';

// Strongly-typed JSONPath
type JsonPath<T> = `$${RecursivePath<T>}`;

// Final DataMirrorValue with free-form string support
type DataMirrorValue<Input, Output> =
    | JsonPath<Input> // Autocompleted paths
    | CustomJsonPath  // Free-form strings
    | ((input: Input) => Output);

// DataMirror definition
export type DataMirror<Input, Output> = {
    [K in keyof Output]: DataMirrorValue<Input, Output[K]>;
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
        const value = jsonpath.query(input, extractor as string);
        
        if (value && Array.isArray(value) && value.some(hasCircular)) {
            throw new Error('Circular data structure detected.');
        }
 
        return {
            ...result,
            [key]: value
        };
    }, {} as Output);
 }

 export { jsonpath }