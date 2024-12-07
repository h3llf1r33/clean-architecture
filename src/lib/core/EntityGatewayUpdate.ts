import { Observable } from "rxjs"
import { EntityGateway } from "./EntityGateway"

export interface EntityGatewayUpdate<ENTITY_ID, QUERY, RESPONSE_MODEL> extends EntityGateway {
    update(entityId: ENTITY_ID, query:Partial<QUERY>): Observable<RESPONSE_MODEL>
}