import { Observable } from "rxjs"
import { EntityGateway } from "./EntityGateway"

export interface EntityGatewayPatch<ENTITY_ID, QUERY, RESPONSE_MODEL> extends EntityGateway {
    patch(entityId: ENTITY_ID, query:Partial<QUERY>): Observable<RESPONSE_MODEL>
}