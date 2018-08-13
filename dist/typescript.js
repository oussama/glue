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
    Javascript:'application/x-javascript',
    Xml:'application/xml',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInR5cGVzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxTQUFTLGtCQUFrQixDQUFDLElBQUk7SUFDNUIsT0FBTyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ3BFLENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLElBQVM7SUFDaEMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRTtRQUN6QixPQUFPLGFBQWEsSUFBSSxDQUFDLElBQUksMkJBQTJCLElBQUksQ0FBQyxJQUFJO29CQUNyRCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUM3QixHQUFHLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxXQUFXLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FDckYsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOzBCQUNBLElBQUksQ0FBQyxJQUFJO1dBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3NCQUNMLElBQUksQ0FBQyxJQUFJO1VBQ3JCLENBQUEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0tBQ1o7U0FBTTtRQUNILE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xCLGFBQWEsSUFBSSxDQUFDLElBQUksMkJBQTJCLElBQUksQ0FBQyxJQUFJOzBCQUM1QyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQ3BEO0FBQ0wsQ0FBQztBQUVELFNBQWdCLFNBQVMsQ0FBQyxHQUFrQjtJQUN4QyxP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QW9CO0lBQzVDLE9BQU87VUFDRCxNQUFNO1NBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQSxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUUsQ0FBQyxDQUFDLENBQUU7U0FDbEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ1gsT0FBTyxLQUFLLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQSxNQUFNLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQztJQUN6SCxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDOztLQUVoQixDQUFDO0FBQ04sQ0FBQztBQUVELFNBQWdCLE9BQU8sQ0FBQyxHQUFRO0lBQzVCLE9BQU8sU0FBUztVQUNWLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1VBQzNDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1VBQ25DLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFDLElBQUk7VUFDdEYsNkJBQTZCO1VBQzdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUEsRUFBRTtZQUN6QixPQUFPLE1BQU0sS0FBSyxDQUFDLElBQUksbUJBQW1CLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztVQUNaLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFWRCwwQkFVQztBQU9ELElBQUksU0FBUyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBc05mLENBQUMifQ==