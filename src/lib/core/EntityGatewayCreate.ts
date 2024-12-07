import { Observable } from "rxjs"
import { EntityGateway } from "./EntityGateway"

export interface EntityGatewayCreate<QUERY, RESPONSE_MODEL> extends EntityGateway {
    create(query:Partial<QUERY>): Observable<RESPONSE_MODEL>
}