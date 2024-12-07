import { Observable } from "rxjs"

export interface EntityGatewayReplace<ENTITY_ID, QUERY,RESPONSE_MODEL> {
    replace(entityId: ENTITY_ID, query:Partial<QUERY>): Observable<RESPONSE_MODEL>
}