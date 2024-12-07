import { EntityGatewayCreate } from "./EntityGatewayCreate";
import { EntityGatewayRead } from "./EntityGatewayRead";
import { EntityGatewayReadList } from "./EntityGatewayReadList";
import { EntityGatewayReplace } from "./EntityGatewayReplace";
import { EntityGatewayDelete } from "./EntityGatewayDelete";
import { EntityGateway } from "./EntityGateway";
import { EntityGatewayUpdate } from "./EntityGatewayUpdate";

export interface EntityGatewayCrud<
    CREATE_OR_UPDATE_QUERY, RESPONSE_MODEL, 
    FILTER_QUERY, READ_ENTITY_ID, 
    UPDATE_ENTITY_ID, DELETE_ENTITY_ID, 
    DELETE_RESPONSE_MODEL 
> extends 
    EntityGateway,
    EntityGatewayCreate<CREATE_OR_UPDATE_QUERY, RESPONSE_MODEL>,
    EntityGatewayRead<READ_ENTITY_ID, FILTER_QUERY, RESPONSE_MODEL>,
    EntityGatewayReadList<FILTER_QUERY, RESPONSE_MODEL>,
    EntityGatewayUpdate<UPDATE_ENTITY_ID, CREATE_OR_UPDATE_QUERY, RESPONSE_MODEL>,
    EntityGatewayReplace<UPDATE_ENTITY_ID, CREATE_OR_UPDATE_QUERY, RESPONSE_MODEL>,
    EntityGatewayDelete<DELETE_ENTITY_ID, DELETE_RESPONSE_MODEL> {
}