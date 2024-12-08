import { from, Observable } from "rxjs";
import { IHttpClient } from "./interfaces/IHttpClient";

import axios from "axios"

type HttpClientMiddleware = ((headers?:Record<string, string>) => void)

export class HttpClient implements IHttpClient {
    public baseUrl = ""
    private httpClient = axios;

    constructor(private _baseUrl: string = "", private middleware: HttpClientMiddleware[] = []){
        if(_baseUrl) this.baseUrl = _baseUrl
    }

    private interceptor<T>(src: Observable<T> | Observable<Axios.AxiosXHR<T>>, headers?:Record<string, string>): Observable<T> | Observable<Axios.AxiosXHR<T>> {
        this.middleware.forEach(fn => {
            fn(headers);
        })
        return src
    }

    get<T>(path:string, headers?: Record<string, string>): Observable<T> {
        return this.interceptor<T>(from(this.httpClient.get<T>(this.baseUrl + path, {headers}).then((resp) => resp.data)), headers) as Observable<T>
    }
    getAJAX<T>(path:string, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>> {
        return this.interceptor<T>(from(this.httpClient.get<T>(this.baseUrl + path, {headers})), headers) as Observable<Axios.AxiosXHR<T>>
    }
    post<T>(path:string, body?: Record<string, any>, headers?: Record<string, string>): Observable<T> {
        return this.interceptor<T>(from(this.httpClient.post<T>(this.baseUrl + path, body, {headers}).then((resp) => resp.data))) as Observable<T>
    }
    postAJAX<T>(path:string, body?: Record<string, any>, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>> {
        return this.interceptor<T>(from(this.httpClient.post<T>(this.baseUrl + path, body, {headers}))) as Observable<Axios.AxiosXHR<T>>
    }
    put<T>(path:string, body?: Record<string, any>, headers?: Record<string, string>): Observable<T> {
        return this.interceptor<T>(from(this.httpClient.put<T>(this.baseUrl + path, body, {headers}).then((resp) => resp.data))) as Observable<T>
    }
    putAJAX<T>(path:string, body?: Record<string, any>, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>> {
        return this.interceptor<T>(from(this.httpClient.put<T>(this.baseUrl + path, body, {headers}))) as Observable<Axios.AxiosXHR<T>>
    }
    patch<T>(path: string, body?: Record<string, any>, headers?: Record<string, string>): Observable<T> {
        return this.interceptor<T>(from(this.httpClient.patch<T>(this.baseUrl + path, body, {headers}).then((resp) => resp.data))) as Observable<T>
    }
    patchAJAX<T>(path: string, body?: Record<string, any>, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>> {
        return this.interceptor<T>(from(this.httpClient.patch<T>(this.baseUrl + path, body, {headers}))) as Observable<Axios.AxiosXHR<T>>
    }
    delete<T>(path:string, headers?: Record<string, string>): Observable<T> {
        return this.interceptor<T>(from(this.httpClient.delete<T>(this.baseUrl + path, {headers}).then((resp) => resp.data))) as Observable<T>
    }
    deleteAJAX<T>(path:string, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>> {
        return this.interceptor<T>(from(this.httpClient.delete<T>(this.baseUrl + path, {headers}))) as Observable<Axios.AxiosXHR<T>>
    }   
}
