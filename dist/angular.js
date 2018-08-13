"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("./typescript");
function genRoutes(route) {
    return `
    export class ${route.name}Service {
        constructor(private service:GlueService){}

        ${route.handlers.map(handler => `${typescript_1.getRouteFunction(handler)}(${handler.inputs.map(input => `${input.name}:${input.type}`).join(',')}){
                return this.service.json('${handler.method.toLowerCase()}','${handler.path}',${handler.inputs.length ? handler.inputs[0].name : null})    
            }`).join('\n')}
    }
    `;
}
function codegen(ast) {
    return code1 +
        `
    ${ast.data.routes.map(route => {
            return `${route.name.toLowerCase()} = new ${route.name}Service(this);`;
        }).join('\n')}
    `
        + code2 + ast.data.objects.map(typescript_1.genInterface).concat(ast.data.routes.map(genRoutes)).join('\n');
}
exports.codegen = codegen;
let code1 = `
import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable,Subscribable } from "rxjs/Observable";
import 'rxjs';
import {environment} from '../environments/environment';

export class GlueService {
`;
let code2 = `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbImFuZ3VsYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSw2Q0FBOEQ7QUFFOUQsU0FBUyxTQUFTLENBQUMsS0FBWTtJQUMzQixPQUFPO21CQUNRLEtBQUssQ0FBQyxJQUFJOzs7VUFHbkIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFBLEVBQUUsQ0FDMUIsR0FBRyw2QkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUEsRUFBRSxDQUFBLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDOzRDQUNsRSxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxNQUFNLE9BQU8sQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJO2NBQ3JJLENBQ0wsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDOztLQUVmLENBQUM7QUFDTixDQUFDO0FBRUQsU0FBZ0IsT0FBTyxDQUFDLEdBQVE7SUFJNUIsT0FBTyxLQUFLO1FBQ1o7TUFDRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFBLEVBQUU7WUFDekIsT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFVBQVUsS0FBSyxDQUFDLElBQUksZ0JBQWdCLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztLQUNaO1VBQ0EsS0FBSyxHQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoRyxDQUFDO0FBWEQsMEJBV0M7QUFHRCxJQUFJLEtBQUssR0FBRzs7Ozs7Ozs7Q0FRWCxDQUFDO0FBQ0YsSUFBSSxLQUFLLEdBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTZDVixDQUFDIn0=