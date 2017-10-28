

import { DataStructure, Route, RouteHandler, AST, RouteGuard } from "./ast";

function getValidatorSource(name){
    return builtinValidators.indexOf(name)==-1 ? 'validators': 'is';
}

function genPropValidation(prop: any) {
    if (prop.validations.length) {
        return `if(_input.${prop.name} != undefined && _input.${prop.name} != null ){
        let err = ${prop.validations.map(v =>
                `${getValidatorSource(v.name)}.${v.name}(_input.${prop.name},${v.args.join(',')})`
            ).join(' || ')}
        if(err) return '${prop.name}: '+err;
        }${prop.required ? `else{
            return "${prop.name} is required" ;
        }`: ``}`;
    } else {
        return prop.required ?
            `if(_input.${prop.name} == undefined || _input.${prop.name} == null )
                return '${prop.name} is required';` : '';
    }
}

export function genObject(obj: DataStructure) {
    return genInterface(obj) + `
        export function parse${obj.name}(_input:any){
            if(!_input) return undefined;
            let out:any = {};
                ${obj.props.map(prop =>
`            let ${prop.name} = parse${prop.type}(_input.${prop.name}); 
            if(${prop.name}!=undefined) out.${prop.name} = ${prop.name}`).join(';\n')}
            return out;
        }
        export function validate${obj.name}(_input:${obj.name}){
            ${ obj.props.map(genPropValidation).filter(elm => elm).join('\n')}
        }
    `;
}


export function genInterface(obj: DataStructure) {
    return `export interface ${obj.name} {
    ${obj.props.map(elm => `  ${elm.name}${elm.required?'':'?'}: ${elm.type}`).join(';\n')}
    }\n`;
}


export function genRoutes(route: Route) {
    let structName = `${route.name}Handlers`;
    let instanceName = `${route.name}HandlersInstance`
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
                ${
                handler.guards.map(guard => {
                    let guardMethod = guard.name;
                    return `let ${guardMethod}Guard = await guards.${guardMethod}(${['ctx'].concat(guard.args).join(',')});
                            if(${guardMethod}Guard) return ${guardMethod}Guard\n`;;
                }).join('\n')
                }
                ${
                handler.inputs.map(input => {

                    return `let ${input.name} = parse${input.type}(ctx.params);
                        let validationError = validate${input.type}(${input.name});
                        if(validationError) return BadRequest({message:'${input.name}: '+validationError,type:'validation',field:'${input.name}',constraint:'${input.type}'});
                        sanitize(${input.name});
                        `;
                })
                }
                
                return ${route.name}HandlersInstance.${handlerMethod}(ctx,${handler.inputs.map(input => input.name).join(',')})
            });`;

        }).join('\n')};
    }`;

}


export function getRouteFunction(route: RouteHandler) {
    let tokens = route.name.split(/\s/g).map(capitalizeFirstLetter);
    let firstToken = tokens.shift().toLowerCase();
    let handlerName = firstToken+tokens.join('');

    //console.log('handlerName', action.name, handlerName, path);
    if (!handlerName) handlerName = route.method.toLowerCase() +
        route.path.split('/').filter(elm => elm)
            .map(elm => elm.replace(/{/g, '')
                .replace(/}/g, ''))
            .map(capitalizeFirstLetter)
            .join('');
    return handlerName;
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


let builtinValidators = ['email','max','min','range','enum'];
function genValidatorsInterface(validators: any[]) {
    return `export interface Validators {
            ${validators
                .filter(elm=> builtinValidators.indexOf(elm.name)==-1 )
                .map(elm => {
            return `  ${elm.name}(${['input:any'].concat(elm.args.map((arg,i)=>`arg${i}:${arg}`)).join(',')});`;
        }).join('\n')}
            }
    `;
}
let builtinGuards = [];
function genGuardsInterface(guards: RouteGuard[]) {
    return `export interface Guards {
        ${guards
            .filter(elm=> builtinGuards.indexOf(elm.name)==-1 )
            .map(elm => {
            return `  ${elm.name}(${['ctx:Context'].concat(elm.args.map((arg,i)=>`arg${i}:${arg}`)).join(',')}):Promise<any>;\n`;
        }).join('\n')}
        }
    `;
}

export function codegen(ast: AST) {
    return functions
        + genValidatorsInterface(ast.data.validators)
        + genGuardsInterface(ast.data.guards)
        + ast.data.objects.map(genObject).concat(ast.data.routes.map(genRoutes)).join('\n')+'\n'
        + `function addRoutes(router){`
        + ast.data.routes.map(route=>{
            return `add${route.name}Routes(router);\n`;
        }).join('\n')
        +`}`;
}






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