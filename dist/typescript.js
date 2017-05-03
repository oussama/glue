"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getValidatorSource(name) {
    return builtinValidators.indexOf(name) == -1 ? 'validators' : 'is';
}
function genPropValidation(prop) {
    if (prop.validations.length) {
        return `if(input.${prop.name} != undefined && input.${prop.name} != null ){
        let err = ${prop.validations.map(v => `${getValidatorSource(v.name)}.${v.name}(input.${prop.name},${v.args.join(',')})`).join(' || ')}
        if(err) return '${prop.name}: '+err;
        }${prop.required ? `else{
            return "${prop.name} is required" ;
        }` : ``}`;
    }
    else {
        return prop.required ?
            `if(input.${prop.name} == undefined || input.${prop.name} == null )
                return '${prop.name} is required';` : '';
    }
}
function genObject(obj) {
    return genInterface(obj) + `
        export function parse${obj.name}(input:any){
            if(!input) return undefined;
            return {
                ${obj.props.map(prop => ` ${prop.name}:parse${prop.type}(input.${prop.name})`).join(',\n')}
            }
        }
        export function validate${obj.name}(input:${obj.name}){
            ${obj.props.map(genPropValidation).filter(elm => elm).join('\n')}
        }
    `;
}
exports.genObject = genObject;
function genInterface(obj) {
    return `export interface ${obj.name} {
    ${obj.props.map(elm => `  ${elm.name}: ${elm.type}`).join(';\n')}
    }\n`;
}
exports.genInterface = genInterface;
function genRoutes(route) {
    let structName = `${route.name}Handlers`;
    let instanceName = `${route.name}HandlersInstance`;
    return `let ${instanceName}:${structName};
    export function setup${route.name}(handler:${structName}){
        ${instanceName}=handler;
    }
    export interface ${structName} {
         ${route.handlers.map(handler => {
        let handlerMethod = getRouteFunction(handler);
        return `  ${handlerMethod}(${['ctx:Context'].concat(handler.inputs.map(input => `${input.name}:${input.type}`)).join(',')}):Promise<Res>;`;
    }).join('\n')}
    }
    export function addRoutes(router){
        ${route.handlers.map(handler => {
        let handlerMethod = getRouteFunction(handler);
        return `router.addRoute('${handler.method}','${handler.path}',async(ctx)=>{
                ${handler.guards.map(guard => {
            let guardMethod = guard.name;
            return `let ${guardMethod}Guard = await guards.${guardMethod}(${['ctx'].concat(guard.args).join(',')});
                            if(${guardMethod}Guard) return ${guardMethod}Guard\n`;
            ;
        }).join('\n')}
                ${handler.inputs.map(input => {
            return `let ${input.name} = parse${input.type}(ctx.params);
                        let validationError = validate${input.type}(${input.name});
                        if(validationError) return BadRequest('${input.name}: '+validationError);
                        `;
        })}
                return ${route.name}HandlersInstance.${handlerMethod}(ctx,${handler.inputs.map(input => input.name).join(',')})
            });`;
    }).join('\n')};
    }`;
}
exports.genRoutes = genRoutes;
function getRouteFunction(route) {
    let handlerName = route.name.split(/\s/g).map(capitalizeFirstLetter).join('');
    if (!handlerName)
        handlerName = route.method.toLowerCase() +
            route.path.split('/').filter(elm => elm)
                .map(elm => elm.replace(/{/g, '')
                .replace(/}/g, ''))
                .map(capitalizeFirstLetter)
                .join('');
    return handlerName;
}
exports.getRouteFunction = getRouteFunction;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
let builtinValidators = ['email', 'max', 'min', 'range'];
function genValidatorsInterface(validators) {
    return `export interface Validators {
            ${validators
        .filter(elm => builtinValidators.indexOf(elm.name) == -1)
        .map(elm => {
        return `  ${elm.name}(${['input:any'].concat(elm.args.map((arg, i) => `arg${i}:${arg}`)).join(',')});`;
    }).join('\n')}
            }
    `;
}
let builtinGuards = [];
function genGuardsInterface(guards) {
    return `export interface Guards {
        ${guards
        .filter(elm => builtinGuards.indexOf(elm.name) == -1)
        .map(elm => {
        return `  ${elm.name}(${['ctx:Context'].concat(elm.args.map((arg, i) => `arg${i}:${arg}`)).join(',')}):Promise<any>;\n`;
    }).join('\n')}
        }
    `;
}
function codegen(ast) {
    return functions
        + genValidatorsInterface(ast.data.validators)
        + genGuardsInterface(ast.data.guards)
        + ast.data.objects.map(genObject).concat(ast.data.routes.map(genRoutes)).join('\n');
}
exports.codegen = codegen;
let functions = `

let is = {
    required:(input)=>{
        if(input==undefined || input==null || input == '') return 'required';
    },
    range:(input,min,max)=>{
        if(input<min || input>max) return 'out of range';
    },
    min:(input,min)=>{
        if(input<min) return 'less than min '+min;
    },
    max:(input,max)=>{
         if(input>max) return 'greater than max '+max;
    },
    string:(input)=>{
         if(typeof input !='string') return 'must be string';
    },
    email:(input)=>{
        if(!validator.isEmail(input)) return 'must be email';
    }
}


import * as validator from "validator";


export class AbstractRouter {

    addRoute(method:string,path:string,handler:any){
        throw "unimplemented";
    }
    setup(){
        
    }
    addRoutes(){
        addRoutes(this.addRoute);
    }
}

export class ExpressRouter {
    app;
    setup(app){
        this.app = app;
        addRoutes(this);
    }
    addRoute(method:string,path:string,handler:any){
        path = path.replace(/{/g,':').replace(/}/g,'');
        this.app[method.toLowerCase()](path ,function(req,res){
            let params = Object.assign({},req.params);
            params = Object.assign(params,req.body);
            params = Object.assign(params,req.query);
            let ctx = {req,res,params};
            handler(ctx)
            .then(data=>{
                res.status(data.status).send(data.error||data.data);
            })
            .catch(err=>{
                res.status(500).send({message:err.message,stack:err.stack.split("\\n")});
            });
        });
        console.log(method,path);
    }
}

import * as querystring from 'querystring';

export class SocketIORouter {
    io;
    setup(io){
        this.io = io;
        io.on('connection', (socket)=> {
            socket.timestamp = {};
            socket.on('disconnect', () => {
                //auth.events.emit('disconnect', socket);
            });

            var params = querystring.parse(socket.request.url.split('?')[1]);
            socket.params = params;
            socket.addRoute = this.addRoute.bind(socket);
            addRoutes(socket);

        });
    }

    addRoute(method,path, handler: Function) {
        let socket:any = this;
        socket.on(method.toLowerCase()+path, (data) => {
            let ctx = {socket,params:Object.assign(socket.params,data)};
            handler(ctx)
            .then(data=>{
                socket.emit(data.__id, data);
            })
            .catch(err=>{
                socket.emit(data.id, { status:500, error: {message:err.message,stack:err.stack.split("\\n")} });
            });
        });
    }
}

export interface Error extends Res {
    data?:any;
    error?:string;
    status:number;
}
export interface Res {
    data?:any;
    error?:string;
    status:number;
}
export function Ok(data:any,status:number=200):Res {
    return {
        error:null,
        data,
        status,
    }
}
export function Err(error?:string,status:number=500):Res{
    return {
        error,
        data:null,
        status,
    }
}

export let NotFound = (message?:any)=> Err(message|| 'not found',404);
export let Unauthorized = (message?:any)=> Err(message|| 'unauthorized',401);
export let BadRequest = (message?:any)=> Err(message|| 'bad request',400);
export let Forbidden = (message?:any)=> Err(message|| 'forbidden',403);

export interface Context {

}

let validators:Validators;
let guards:Guards;




export let routers = {
    express: new ExpressRouter(),
    socketio: new SocketIORouter()
}

export function setup(_validators:Validators,_guards:Guards){
    validators = _validators;
    guards = _guards;
}


export function parsestring(input:any){
    if(input == undefined || input == null) return undefined;
    return input.toString();
}
export function parsenumber(input:any){
    if(input == undefined || input == null) return undefined;
    return parseFloat(input);
}
export function parseboolean(input:any){
    if(input == undefined || input == null) return undefined;
    return Boolean(input);
}

`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9PdXNzYW1hL1Byb2plY3RzL2dsdWUvc3JjLyIsInNvdXJjZXMiOlsidHlwZXNjcmlwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLDRCQUE0QixJQUFJO0lBQzVCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUUsQ0FBQyxDQUFDLEdBQUcsWUFBWSxHQUFFLElBQUksQ0FBQztBQUNwRSxDQUFDO0FBRUQsMkJBQTJCLElBQVM7SUFDaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxZQUFZLElBQUksQ0FBQyxJQUFJLDBCQUEwQixJQUFJLENBQUMsSUFBSTtvQkFDbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUMxQixHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxVQUFVLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FDcEYsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOzBCQUNBLElBQUksQ0FBQyxJQUFJO1dBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUc7c0JBQ0wsSUFBSSxDQUFDLElBQUk7VUFDckIsR0FBRSxFQUFFLEVBQUUsQ0FBQztJQUNiLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUTtZQUNoQixZQUFZLElBQUksQ0FBQyxJQUFJLDBCQUEwQixJQUFJLENBQUMsSUFBSTswQkFDMUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQ3JELENBQUM7QUFDTCxDQUFDO0FBRUQsbUJBQTBCLEdBQWtCO0lBQ3hDLE1BQU0sQ0FBQyxZ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