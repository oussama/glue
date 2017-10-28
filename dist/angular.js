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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9vdXNzYS93b3JrL2dsdWUvc3JjLyIsInNvdXJjZXMiOlsiYW5ndWxhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLDZDQUE4RDtBQUU5RCxtQkFBbUIsS0FBWTtJQUMzQixNQUFNLENBQUM7bUJBQ1EsS0FBSyxDQUFDLElBQUk7OztVQUduQixLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQ3hCLEdBQUcsNkJBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDOzRDQUNsRSxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxNQUFNLE9BQU8sQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSTtjQUNySSxDQUNMLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzs7S0FFZixDQUFDO0FBQ04sQ0FBQztBQUVELGlCQUF3QixHQUFRO0lBSTVCLE1BQU0sQ0FBQyxLQUFLO1FBQ1o7TUFDRSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSztZQUN2QixNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxVQUFVLEtBQUssQ0FBQyxJQUFJLGdCQUFnQixDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDWjtVQUNBLEtBQUssR0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEcsQ0FBQztBQVhELDBCQVdDO0FBR0QsSUFBSSxLQUFLLEdBQUc7Ozs7Ozs7O0NBUVgsQ0FBQztBQUNGLElBQUksS0FBSyxHQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0E2Q1YsQ0FBQyJ9