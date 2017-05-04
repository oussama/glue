
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable, Subscribable } from "rxjs/Observable";
import 'rxjs';
import { environment } from '../environments/environment';

export class GlueService {

    authentication = new AuthenticationService(this);

    constructor(private http: Http) { }

    token = '';

    beforeRequest(options) {
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.token);
        options.headers = headers;
    }

    json(method, path, body?) {
        return this.api(method, path, body)
            .map(res => res.json());
    }

    api(method, path, body?) {
        return this.request(environment.apiURL, method, path, body)
            .catch(this.handleError);
    }

    handleError(res: Response, caught) {
        if (res.status == 401) {
            return Observable.empty();
        }
        return Observable.throw(res);
    }

    request(apiURL, method, action, body?): Observable<any> {
        console.log(method, action);
        var search = new URLSearchParams();
        if (body && method == 'GET') {
            for (var key in body) {
                if (body.hasOwnProperty(key)) {
                    var element = body[key];
                    search.set(key, element);
                }
            }
        }
        let options: any = { method, search, body };
        this.beforeRequest(options);
        return this.http.request(apiURL + action, options)
    }

}
export interface GetQuestionByIdForm {
    id: number
}

export interface RegisterForm {
    auth: EmailCreds;
    user: UserInfo
}

export interface ChangePasswordForm {
    current_password: string;
    new_password: string
}

export interface EmailCreds {
    email: string;
    password: string
}

export interface UserInfo {
    first_name: string;
    last_name: string;
    birth_date: string;
    birth_place: string
}

export interface AuthResponse {
    token: string;
    user_id: number;
    email: EmailCreds
}


export class AuthenticationService {
    constructor(private service: GlueService) { }

    getQuestionById(arg0: GetQuestionByIdForm) {
        return this.service.json('get', '/auth/{question_id}', arg0)
    }
    register(arg0: RegisterForm) {
        return this.service.json('post', '/auth/register', arg0)
    }
    login(arg0: EmailCreds) {
        return this.service.json('post', '/auth/login', arg0)
    }
    changePassword(arg0: ChangePasswordForm) {
        return this.service.json('post', '/auth/password', arg0)
    }
}
