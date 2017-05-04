


import { Route, AST } from "./ast";
import { getRouteFunction, genInterface } from "./typescript";

function genRoutes(route: Route) {
    return `
    export class ${route.name}Service {
        constructor(private service:GlueService){}

        ${route.handlers.map(handler=>
            `${getRouteFunction(handler)}(${handler.inputs.map(input=>`${input.name}:${input.type}`).join(',')}){
                return this.service.json('${handler.method.toLowerCase()}','${handler.path}',${handler.inputs[0].name})    
            }`    
        ).join('\n')}
    }
    `;
}

export function codegen(ast: AST) {
    /*return functions
        + genValidatorsInterface(ast.data.validators)
        + genGuardsInterface(ast.data.guards)*/
    return code1+
    `
    ${ast.data.routes.map(route=>{
        return `${route.name.toLowerCase()} = new ${route.name}Service(this);`;
    }).join('\n')}
    `
    +code2+ast.data.objects.map(genInterface).concat(ast.data.routes.map(genRoutes)).join('\n');
}


let code1 = `
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable,Subscribable } from "rxjs/Observable";
import 'rxjs';
import {environment} from '../environments/environment';

export class GlueService {
`;
let code2 =`
    constructor(private http: Http) {}

    token = '';

    beforeRequest(options){
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.token);
        options.headers = headers;
    }

    json(method,path,body?){
        return this.api(method,path,body)
            .map(res=>res.json());
    }

    api(method, path, body?) {
        return this.request(environment.apiURL,method,path,body)
            .catch(this.handleError);
    }

    handleError(res:Response,caught){
        if(res.status == 401){
            return Observable.empty();
        }
        return Observable.throw(res);
    }

    request(apiURL, method, action, body?):Observable<any> {
        console.log(method,action);
        var search = new URLSearchParams();
        if (body && method == 'GET') {
            for (var key in body) {
                if (body.hasOwnProperty(key)) {
                    var element = body[key];
                    search.set(key, element);
                }
            }
        }
        let options:any = { method, search, body };
        this.beforeRequest(options);
        return  this.http.request(apiURL + action, options )
    }

}
`;

