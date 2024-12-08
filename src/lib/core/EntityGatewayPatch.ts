import { Observable } from "rxjs"

export interface EntityGatewayPatch<ENTITY_ID, QUERY,RESPONSE_MODEL> {
    patchEntity(entityId: ENTITY_ID, query:Partial<QUERY>): Observable<RESPONSE_MODEL>
}