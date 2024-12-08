import { Observable } from "rxjs"
import { EntityGateway } from "./EntityGateway"

export interface EntityGatewayReplace<ENTITY_ID, QUERY, RESPONSE_MODEL> extends EntityGateway {
    replaceEntity(entityId: ENTITY_ID, query: QUERY): Observable<RESPONSE_MODEL>
}