import { Observable } from "rxjs";
import { UserCrudEntityGateway } from "./UserCrudEntityGateway";
import { IUser } from "../../lib/interfaces/IUser";


class UserRepository {
    private crudEntityGateway = new UserCrudEntityGateway();

    findByName(name:string): Observable<IUser> {
        return this.crudEntityGateway.read(undefined, {A: "name", operator: "=", B: name})
    }

    findById(id:string): Observable<IUser> {
        return this.crudEntityGateway.read(undefined, {A: "id", operator: "=", B: id})
    }

    findByEmail(email:string): Observable<IUser> {
        return this.crudEntityGateway.read(undefined, {A: "email", operator: "=", B: email})
    }
}