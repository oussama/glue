"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getValidatorSource(name) {
    return builtinValidators.indexOf(name) == -1 ? 'validators' : 'is';
}
function genPropValidation(prop) {
    if (prop.validations.length) {
        return `if(_input.${prop.name} != undefined && _input.${prop.name} != null ){
        let err = ${prop.validations.map(v => `${getValidatorSource(v.name)}.${v.name}(_input.${prop.name},${v.args.join(',')})`).join(' || ')}
        if(err) return '${prop.name}: '+err;
        }${prop.required ? `else{
            return "${prop.name} is required" ;
        }` : ``}`;
    }
    else {
        return prop.required ?
            `if(_input.${prop.name} == undefined || _input.${prop.name} == null )
                return '${prop.name} is required';` : '';
    }
}
function genObject(obj) {
    return genInterface(obj) + `
        export function parse${obj.name}(_input:any){
            if(!_input) return undefined;
            let out:any = {};
                ${obj.props.map(prop => `            let ${prop.name} = parse${prop.type}(_input.${prop.name}); 
            if(${prop.name}!=undefined) out.${prop.name} = ${prop.name}`).join(';\n')}
            return out;
        }
        export function validate${obj.name}(_input:${obj.name}){
            ${obj.props.map(genPropValidation).filter(elm => elm).join('\n')}
        }
    `;
}
exports.genObject = genObject;
function genInterface(obj) {
    return `export interface ${obj.name} {
    ${obj.props.map(elm => `  ${elm.name}${elm.required ? '' : '?'}: ${elm.type}`).join(';\n')}
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
    export function add${route.name}Routes(router){
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
                        if(validationError) return BadRequest({message:'${input.name}: '+validationError,type:'validation',field:'${input.name}',constraint:'${input.type}'});
                        sanitize(${input.name});
                        `;
        })}
                
                return ${route.name}HandlersInstance.${handlerMethod}(ctx,${handler.inputs.map(input => input.name).join(',')})
            });`;
    }).join('\n')};
    }`;
}
exports.genRoutes = genRoutes;
function getRouteFunction(route) {
    let tokens = route.name.split(/\s/g).map(capitalizeFirstLetter);
    let firstToken = tokens.shift().toLowerCase();
    let handlerName = firstToken + tokens.join('');
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
let builtinValidators = ['email', 'max', 'min', 'range', 'enum'];
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
        + ast.data.objects.map(genObject).concat(ast.data.routes.map(genRoutes)).join('\n') + '\n'
        + `function addRoutes(router){`
        + ast.data.routes.map(route => {
            return `add${route.name}Routes(router);\n`;
        }).join('\n')
        + `}`;
}
exports.codegen = codegen;
let functions = `
export type array = Array<any>;
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
    },
    enum:(input: any, ...args)=> {
        if(args.indexOf(input) == -1) return 'must be one of '+args.join(',');    
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
                res.status(data.status).type(data.contentType).send(data.error||data.data);
            })
            .catch(err=>{
                if(err.error){
                    let data = err;
                    res.status(data.status).type(data.contentType).send(data.error);
                }else if(err.stack){
                    res.status(500).send({message:err.message,stack:err.stack.split("\\n")});
                }else {
                    try{
                        res.status(500).send(JSON.stringify(err));
                    }catch(e){
                        console.log("ERROR",err);
                        res.status(500).send({error:'unknown error'});
                    }
                }
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

export interface ResError {
    type:string,
    message?:string,
    [key:string]:any
}

export interface Res {
    contentType:string,
    data?:any;
    error?:ResError;
    status:number;
}


export var ContentType = {
    Json:'application/json',
    TextCss:'text/css',
    Javascript:'application/x-javascript'
}

export function Ok(data:any,status:number=200,contentType=ContentType.Json):Res {
    return {
        contentType,
        error:null,
        data,
        status,
    }
}

export function Err(error?:ResError,status:number=500):Res{
    return {
        contentType:ContentType.Json,
        error,
        data:null,
        status,
    }
}

export let NotFound = (message?:any)=> Err({type:'not_found',message},404);
export let Unauthorized = (message?:any)=> Err({type:'unauthorized',message},401);
export let BadRequest = (message?:any)=> Err({type:'bad_request',message},400);
export let Forbidden = (message?:any)=> Err({type:'forbidden',message},403);

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

export function parseobject(input:any){
    if(input == undefined || input == null) return undefined;
    if( typeof(input)=='string' ){
        try{
            input = JSON.parse(input);
        }catch(e){
            console.warn('Failed to parse object',input);
            return undefined;
        }
    } 
    return input;
}
export function parsearray(input:any){
    if(input == undefined || input == null) return undefined;
    return input;
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
    if(input=="false" || input=="0") return false;    
    return Boolean(input);
}

function sanitize(input:any){
    for(let key in input){
        if(input[key] == undefined) delete input[key];
    }
}
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9vdXNzYS93b3JrL2dsdWUvc3JjLyIsInNvdXJjZXMiOlsidHlwZXNjcmlwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLDRCQUE0QixJQUFJO0lBQzVCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUUsQ0FBQyxDQUFDLEdBQUcsWUFBWSxHQUFFLElBQUksQ0FBQztBQUNwRSxDQUFDO0FBRUQsMkJBQTJCLElBQVM7SUFDaEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxhQUFhLElBQUksQ0FBQyxJQUFJLDJCQUEyQixJQUFJLENBQUMsSUFBSTtvQkFDckQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUMxQixHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxXQUFXLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FDckYsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOzBCQUNBLElBQUksQ0FBQyxJQUFJO1dBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUc7c0JBQ0wsSUFBSSxDQUFDLElBQUk7VUFDckIsR0FBRSxFQUFFLEVBQUUsQ0FBQztJQUNiLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUTtZQUNoQixhQUFhLElBQUksQ0FBQyxJQUFJLDJCQUEyQixJQUFJLENBQUMsSUFBSTswQkFDNUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0lBQ3JELENBQUM7QUFDTCxDQUFDO0FBRUQsbUJBQTBCLEdBQWtCO0lBQ3hDLE1BQU0sQ0FBQyxZQUFZLENB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