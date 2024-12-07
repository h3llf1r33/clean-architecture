import { Observable } from "rxjs";
import { EntityGatewayCrud } from "../lib/core/EntityGatewayCrud";
import { IFilterQuery } from "../lib/interfaces/IFilterQuery";
import { IUser } from "../lib/interfaces/IUser";
import { IHttpClient } from "../lib/interfaces/IHttpClient";
import { HttpClient } from "../lib/HttpClient";
import { MockServer } from "jest-mock-server";
import { mockUser, mockUsers } from "../mock/User";
const axios = require("axios");
const AxiosMockAdapter = require("axios-mock-adapter");

const mock = new AxiosMockAdapter(axios);


let BASE_URL = '';
const server = new MockServer();

mock.onGet("/users").reply(200, mockUsers(100));
mock.onGet(/\/user\/\d+/).reply(200, mockUser);
mock.onPut(/\/user\/\d+/).reply(200, mockUser);
mock.onPost("/user").reply(201, mockUser);
mock.onDelete(/\/user\/\d+/).reply(200, true);

class TestCrudGateway implements EntityGatewayCrud<
    IUser, IUser, 
    IFilterQuery, string, 
    string, string, boolean
> {
    constructor(private httpClient: IHttpClient){}

    create(query: Partial<IUser>): Observable<IUser> {
        return this.httpClient.post<IUser>("/user", query)
    }
    read(query?: string): Observable<IUser> {
        return this.httpClient.get<IUser>(`/user/${query}`)
    }
    readList(query?: IFilterQuery): Observable<IUser[]> {
        return this.httpClient.get<IUser[]>("/users")
    }
    update(identifier: string, query: Partial<IUser>): Observable<IUser> {
        return this.httpClient.put<IUser>(`/user/${identifier}`, query)
    }
    delete(identifier: string): Observable<boolean> {
        return this.httpClient.delete<boolean>(`/user/${identifier}`)
    }

}

describe('', () => {
    test('should be able to fetch data over each method', async () => {
      const crudEntityGateway = new TestCrudGateway(new HttpClient(""));
  
      const readData = await crudEntityGateway.read("1").toPromise();
      expect(readData).toMatchSnapshot();
  
      const readListData = await crudEntityGateway.readList().toPromise();
      expect(readListData).toMatchSnapshot();
  
      const createData = await crudEntityGateway.create(mockUser).toPromise();
      expect(createData).toMatchSnapshot();
  
      const updateData = await crudEntityGateway.update("1", mockUser).toPromise();
      expect(updateData).toMatchSnapshot();
  
      const deleteData = await crudEntityGateway.delete("1").toPromise();
      expect(deleteData).toMatchSnapshot();
    });
  });
  