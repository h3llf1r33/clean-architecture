import { IOperator } from "./IOperator";

export interface IFilterQuery {
    A: string | number | object,
    operator: IOperator
    B: string | number | object
}

export function convertFilterToQueryParams(filter: IFilterQuery | IFilterQuery[]): string {
    const filters = Array.isArray(filter) ? filter : [filter];
    if (!filters.length) return '';

    const operatorMap: Record<IOperator, string> = {
        '<': 'lt',
        '>': 'gt',
        '<=': 'lte',
        '>=': 'gte',
        '=': 'eq',
        '!=': 'ne',
        'in': 'in',
        'not in': 'notin',  // Changed this to 'notin'
        'like': 'like',
        'not like': 'notlike'  // Changed this for consistency
    };

    const params = filters.map(filter => {
        if (!filter || !filter.A || !filter.operator || !filter.B) {
            return '';
        }

        const fieldName = typeof filter.A === 'string' ? filter.A : JSON.stringify(filter.A);
        let value = filter.B;

        if (Array.isArray(value)) {
            value = value.map(v => v.toString().trim()).join(',');
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
            value = JSON.stringify(value);
        }

        const encodedValue = encodeURIComponent(value as string);
        const operator = operatorMap[filter.operator];

        return `${fieldName}[${operator}]=${encodedValue}`;
    }).filter(param => param !== '');

    return params.length ? `?${params.join('&')}` : '';
}


export function parseQueryParamsToFilter(queryString: string): IFilterQuery[] {
    // Remove the leading '?' if present
    const query = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    if (!query) return [];

    const operatorMap: Record<string, IOperator> = {
        'lt': '<',
        'gt': '>',
        'lte': '<=',
        'gte': '>=',
        'eq': '=',
        'ne': '!=',
        'in': 'in',
        'notin': 'not in',
        'like': 'like',
        'notlike': 'not like'
    };

    const filters = query.split('&').map(param => {
        // Match the pattern fieldName[operator]=value
        const match = param.match(/^([^\[]+)\[([^\]]+)\]=(.+)$/);
        if (!match) return null;

        const [, field, operator, encodedValue] = match;
        const mappedOperator = operatorMap[operator];
        
        if (!mappedOperator) return null;

        let value: string | number | object = decodeURIComponent(encodedValue);
        let fieldValue: string | number | object = field;

        // Try to parse field as number or object if needed
        if (!isNaN(Number(field)) && field !== '') {
            fieldValue = Number(field);
        } else {
            try {
                if (field.startsWith('{') || field.startsWith('[')) {
                    fieldValue = JSON.parse(field);
                }
            } catch (e) {
                // Keep as string if parsing fails
            }
        }

        // Handle different value types
        if (mappedOperator === 'in' || mappedOperator === 'not in') {
            value = value.split(',');
        } else {
            // Try to parse as number if possible
            const numberValue = Number(value);
            if (!isNaN(numberValue) && value !== '') {
                value = numberValue;
            } else {
                // Try to parse as object if it's JSON formatted
                try {
                    if (value.startsWith('{') || value.startsWith('[')) {
                        value = JSON.parse(value);
                    }
                } catch (e) {
                    // Keep as string if parsing fails
                }
            }
        }

        const filter: IFilterQuery = {
            A: fieldValue,
            operator: mappedOperator,
            B: value
        };

        return filter;
    });

    return filters.filter((filter): filter is IFilterQuery => filter !== null);
}