import { EntityGateway } from "./EntityGateway";
import { Observable } from "rxjs";

export interface EntityGatewayReadList<FILTER_QUERY, RESPONSE_MODEL> extends EntityGateway {
    readList(filterQuery?: FILTER_QUERY): Observable<RESPONSE_MODEL[]>
}