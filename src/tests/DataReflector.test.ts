import { inputMockData, InputType, ObjectTestType, OutputType } from "../lib/interfaces/tests/DataMirror";
import { DataReflector, reflect, jsonpath } from "../lib/DataReflector";

test('should handle array paths with wildcards', () => {
    const mirror: DataReflector<InputType, OutputType> = {
        newName: "$['data'][*]['mapping']['test']['value']",
        newValue: "$['data'][*]['mapping']",
        key: "$['key']"
    }
    expect(reflect(mirror, inputMockData)).toMatchSnapshot();
});

test('should handle mixed function and path mappings', () => {
    const mirror: DataReflector<InputType, OutputType> = {
        newName: "$['data'][*]['mapping']['test']['value']",
        newValue: input => String(input.data.length),
        key: "$['key']"
    }
    expect(reflect(mirror, inputMockData)).toMatchSnapshot();
});

test('should handle direct array access and array element property access', () => {
    const mirror: DataReflector<InputType, OutputType> = {
        newName: "$['data'][*]['mapping']['test']['value']",
        newValue: "$['data'][*]['mapping']",
        key: "$['key']"
    }
    expect(reflect(mirror, inputMockData)).toMatchSnapshot();
});

test('should handle nested functions', () => {
    const mirror: DataReflector<InputType, OutputType> = {
        newName: "$['data'][*]['mapping']['test']['value']",
        newValue: input => JSON.stringify(input.data.filter(item => typeof item === 'object')),
        key: input => input.key.toUpperCase()
    }
    expect(reflect(mirror, inputMockData)).toMatchSnapshot();
});

test('should handle empty arrays', () => {
    const emptyInput = {...inputMockData, data: []};
    const mirror: DataReflector<InputType, OutputType> = {
        newName: "$['data'][*]['mapping']['test']['value']",
        newValue: "$['data'][*]['mapping']",
        key: "$['key']"
    }
    expect(reflect(mirror, emptyInput)).toMatchSnapshot();
});

test('should handle valid paths only', () => {
    const mirror: DataReflector<InputType, OutputType> = {
        newName: "$['data'][*]['name']",
        newValue: "$['data'][*]['mapping']",
        key: input => input.time
    }
    expect(reflect(mirror, inputMockData)).toMatchSnapshot();
});

test('should handle complex transformations', () => {
    const mirror: DataReflector<InputType, OutputType> = {
        newName: input => {
            const values = jsonpath.query(input, "$['data'][*]['mapping']['test']['value']");
            return String(values.reduce((a:number,b:number) => Number(a)+Number(b), 0));
        },
        newValue: "$['data'][*]['mapping']",
        key: input => `${input.key}-${input.time}`
    }
    expect(reflect(mirror, inputMockData)).toMatchSnapshot();
});

test('should handle type coercion in functions', () => {
    const mirror: DataReflector<InputType, OutputType> = {
        newName: "$['data'][*]['mapping']['test']['value']",
        newValue: input => String(Boolean(input.data.length)),
        key: input => String(Number(input.time))
    }
    expect(reflect(mirror, inputMockData)).toMatchSnapshot();
});

test('should handle extremely large arrays', (done) => {
    done()
    const largeInput = {...inputMockData};
    largeInput.data = Array(10000).fill({ name: "TEST", mapping: { test: { value: 1 } } });
    const mirror: DataReflector<InputType, OutputType> = {
        newName: "$['data'][*]['mapping']['test']['value']",
        newValue: "$['data'][*]['name']",
        key: "$['key']"
    }
    expect(reflect(mirror, largeInput)).toMatchSnapshot();
 });
 
 test('should handle deeply nested objects', () => {
    const deepInput = {...inputMockData};
    let deepObj: any = { value: 42 };
    for(let i = 0; i < 100; i++) {
        deepObj = { nested: deepObj };
    }
    deepInput.data = [deepObj];
    
    const mirror: DataReflector<InputType, OutputType> = {
        newName: "$..value",
        newValue: "$.data[0]", 
        key: "$['key']"
    }
    expect(reflect(mirror, deepInput)).toMatchSnapshot();
 });
 
 test('should handle functions throwing errors', () => {
    const mirror: DataReflector<InputType, OutputType> = {
        newName: input => { throw new Error('Function error'); },
        newValue: "$['data']",
        key: "$['key']"
    }
    expect(() => reflect(mirror, inputMockData)).toThrow('Function error');
 });
 
 test('should handle malformed input', () => {
    const badInput = { ...inputMockData, data: undefined };
    const mirror: DataReflector<InputType, OutputType> = {
        newName: "$['data'][*]",
        newValue: "$['data']",
        key: "$['key']"
    }
    expect(reflect(mirror, badInput as any)).toMatchSnapshot();
 });
 
 test('should handle Unicode and special characters', () => {
    const unicodeInput = {...inputMockData};
    unicodeInput.data.push({
        name: "测试",
        mapping: { test: { value: 42 } }
    } as ObjectTestType);
    
    const mirror: DataReflector<InputType, OutputType> = {
        newName: "$['data'][*]['name']",
        newValue: input => input.data.map(x => 
            typeof x === 'object' && !Array.isArray(x) && 'name' in x ? x.name : ''
        ).join('→'),
        key: "$.key"
    }
    expect(reflect(mirror, unicodeInput)).toMatchSnapshot();
});
 
test('should handle JSONPath logical operators and filters', () => {
    const mirror: DataReflector<InputType, OutputType> = {
        // Get objects where mapping.test.value exists
        newName: "$.data[?(@.mapping && @.mapping.test && @.mapping.test.value)]",
        
        // Get the object where mapping.test.value inside data array equals 1001
        newValue: "$.data[?(@.mapping.test.value === 1001)]", 
        // Get the object where mapping.test.value inside data array equals 1002
        key: "$.data[?(@.mapping.test.value === 1002)]", 
    }
    const anotherMirror: DataReflector<InputType, OutputType> = {
        // Get name where test.value > 1000
        newName: "$.data[?(@.mapping && @.mapping.test.value > 1000)]", 
        // Get all objects that have a mapping
        newValue: "$.data[?(@.mapping)]",
        // Get the object where mapping.test.value inside data array equals 1002 and is bigger than 2000
        key: "$.data[?(@.mapping.test.value === 1002 && @.mapping.test.value > 2000)]"

    }
    expect(reflect(mirror, inputMockData)).toMatchSnapshot();
    expect(reflect(anotherMirror, inputMockData)).toMatchSnapshot();
});


 test('should throw an error for recursive data structures', () => {
    const recursiveInput = {...inputMockData};
    const obj1: any = { name: "Recursive1" };
    const obj2: any = { name: "Recursive2" };
    obj1.ref = obj2;
    obj2.ref = obj1;
    recursiveInput.data.push(obj1, obj2);
    
    const mirror: DataReflector<InputType, OutputType> = {
        newName: "$['data'][*]['name']",
        newValue: "$['data'][*]['ref']",
        key: "$['key']"
    }
    expect(() => reflect(mirror, recursiveInput)).toThrow('Circular data structure detected.');
 });