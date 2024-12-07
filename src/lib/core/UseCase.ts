export interface UseCase<QUERY, RESPONSE_MODEL> {
    execute(query?:QUERY): RESPONSE_MODEL
}