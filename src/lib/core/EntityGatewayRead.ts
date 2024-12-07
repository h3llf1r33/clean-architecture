import { EntityGateway } from "./EntityGateway";
import { Observable } from "rxjs";

export interface EntityGatewayRead<ENTITY_ID, FILTER_QUERY, RESPONSE_MODEL> extends EntityGateway {
    read(query?: ENTITY_ID, filterQuery?: FILTER_QUERY): Observable<RESPONSE_MODEL>
}