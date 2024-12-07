import { Observable } from "rxjs"

export interface EntityGatewayUpdate<ENTITY_ID, QUERY,RESPONSE_MODEL> {
    update(entityId: ENTITY_ID, query:Partial<QUERY>): Observable<RESPONSE_MODEL>
}