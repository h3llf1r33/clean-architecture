import { Observable } from "rxjs"
import { EntityGateway } from "./EntityGateway"

export interface EntityGatewayDelete<ENTITY_ID, RESPONSE_MODEL> extends EntityGateway {
    delete(entityId: ENTITY_ID): Observable<RESPONSE_MODEL>
}