import { AjaxResponse } from "rxjs/ajax";
import { Observable } from "rxjs";
import { HttpClient } from "../HttpClient"; // Assuming this is where your HttpClient class is

// Updated IHttpClient interface with constructor signature
export interface IHttpClient {
    baseUrl:string
    get<T>(path:string, headers?: Record<string, string>): Observable<T>;
    getAJAX<T>(path:string, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>>;
    post<T>(path:string, body?: Record<string, any>, headers?: Record<string, string>): Observable<T>;
    postAJAX<T>(path:string, body?: Record<string, any>, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>>;
    put<T>(path:string, body?: Record<string, any>, headers?: Record<string, string>): Observable<T>;
    putAJAX<T>(path:string, body?: Record<string, any>, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>>;
    delete<T>(path:string, headers?: Record<string, string>): Observable<T>;
    deleteAJAX<T>(path:string, headers?: Record<string, string>): Observable<Axios.AxiosXHR<T>>;
}
