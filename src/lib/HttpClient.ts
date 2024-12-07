import { from, Observable } from "rxjs";
import { IHttpClient } from "./interfaces/IHttpClient";

import axios from "axios"

export class HttpClient implements IHttpClient {
    public baseUrl = ""
    private httpClient = axios;

    constructor(private _baseUrl?: string){
        if(_baseUrl) this.baseUrl = _baseUrl
    }

    get<T>(path:string, headers?: Record<string, string>): Observable<T> {
        return from(this.httpClient.get<T>(this.baseUrl + path, {headers}).then((resp) => resp.data))
    }
    getAJAX<T>(path:string, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>> {
        return from(this.httpClient.get<T>(this.baseUrl + path, {headers}))
    }
    post<T>(path:string, body?: Record<string, any>, headers?: Record<string, string>): Observable<T> {
        return from(this.httpClient.post<T>(this.baseUrl + path, body, {headers}).then((resp) => resp.data))
    }
    postAJAX<T>(path:string, body?: Record<string, any>, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>> {
        return from(this.httpClient.post<T>(this.baseUrl + path, body, {headers}))
    }
    put<T>(path:string, body?: Record<string, any>, headers?: Record<string, string>): Observable<T> {
        return from(this.httpClient.put<T>(this.baseUrl + path, body, {headers}).then((resp) => resp.data))
    }
    putAJAX<T>(path:string, body?: Record<string, any>, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>> {
        return from(this.httpClient.put<T>(this.baseUrl + path, body, {headers}))
    }
    patch<T>(path: string, body?: Record<string, any>, headers?: Record<string, string>): Observable<T> {
        return from(this.httpClient.patch<T>(this.baseUrl + path, body, {headers}).then((resp) => resp.data))
    }
    patchAJAX<T>(path: string, body?: Record<string, any>, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>> {
        return from(this.httpClient.patch<T>(this.baseUrl + path, body, {headers}))
    }
    delete<T>(path:string, headers?: Record<string, string>): Observable<T> {
        return from(this.httpClient.delete<T>(this.baseUrl + path, {headers}).then((resp) => resp.data))
    }
    deleteAJAX<T>(path:string, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>> {
        return from(this.httpClient.delete<T>(this.baseUrl + path, {headers}))
    }   
}
