import { Observable } from "rxjs"
import { EntityGatewayCrud } from "../../lib/core/EntityGatewayCrud"
import { convertFilterToQueryParams, IFilterQuery } from "../../lib/interfaces/IFilterQuery"
import { IHttpClient } from "../../lib/interfaces/IHttpClient"
import { IUser } from "../../lib/interfaces/IUser"
import { HttpClient } from "../../lib/HttpClient"

export class UserCrudEntityGateway implements EntityGatewayCrud<
    IUser, IUser, 
    IFilterQuery, string, 
    string, string, boolean
> {
    private readonly httpClient: IHttpClient;

    constructor(private _httpClient?: IHttpClient){
        this.httpClient = _httpClient ?? new HttpClient();
    }

    create(query: Partial<IUser>): Observable<IUser> {
        return this.httpClient.post<IUser>("/user", query)
    }
    read(query?: string, filterQuery?: IFilterQuery): Observable<IUser> {
        const queryParams = filterQuery ? convertFilterToQueryParams(filterQuery) : ""
        return this.httpClient.get<IUser>(`/user${query ? `/${query + queryParams}` : queryParams}`)
    }
    readList(filterQuery?: IFilterQuery): Observable<IUser[]> {
        const queryParams = filterQuery ? convertFilterToQueryParams(filterQuery) : ""
        return this.httpClient.get<IUser[]>(`/user${queryParams}`)
    }
    update(entityId: string, query: Partial<IUser>): Observable<IUser> {
        return this.httpClient.put<IUser>(`/user/${entityId}`, query)
    }
    delete(entityId: string): Observable<boolean> {
        return this.httpClient.delete<boolean>(`/user/${entityId}`)
    }

}