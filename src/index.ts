import * as fs from "fs";
import * as validator from "validator";

let protagonist = require('protagonist');


let validationBuiltins = ['min', 'required', 'max', 'range', 'string'];
let routes = `let _app;
function addRoutes(){
`;

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
}


import * as validator from "validator";

function addRoute(method:string,path:string,handler:any){
    path = path.replace(/{/g,':').replace(/}/g,'');
    _app[method.toLowerCase()](path ,function(req,res){
        let params = Object.assign({},req.params);
        params = Object.assign(params,req.body);
        params = Object.assign(params,req.query);
        let ctx = {req,res,params};
        handler(ctx)
        .then(data=>{
            res.status(data.status).send(data.error||data.data);
        })
        .catch(err=>{
            res.status(500).send(err);
        });
    });
    console.log(method,path);
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

export function NotFound(message?:string){
    return Err(message || 'not found',404);
}

export function Forbidden(message?:string){
    return Err(message || 'forbidden',404);
}

export function BadRequest(message?:string){
    return Err(message || 'bad request',401);
}

export interface Context {

}

let validators:Validators;
let guards:Guards;

function _setup(_validators:Validators,_guards:Guards){
    validators = _validators;
    guards = _guards;
}
export function setup(app,validators:Validators,guards:Guards){
    _app = app;
    addRoutes();
    _setup(validators,guards);
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
//let file = fs.readFileSync('./data/test.apib').toString();

export function convert(file: string) {
    return new Promise((resolve, reject) => {

        protagonist.parse(file, { type: 'ast' }, function (error, result) {
            if (error) {
                console.log(error);
                return;
            }

            parse(result.ast);

            let handlersInterface = '';
            let allhandlers = handlers;
            for (let category in allhandlers) {
                let handlers = allhandlers[category];
                let structName = `${category}Handlers`;
                let instanceName = `${category}HandlersInstance`
                handlersInterface += `let ${instanceName}:${structName};\nexport interface ${structName} {\n`;
                for (let key in handlers) {
                    let args = handlers[key].map((arg, i) => `arg${i}:${arg}`);
                    args.unshift('ctx:Context');
                    handlersInterface += `  ${key}(${args.join(',')}):Promise<Res>;\n`;
                }
                handlersInterface += `}
        export function setup${category}(handler:${structName}){
            ${instanceName}=handler;
        }
        `;
            }
            let validatorsInterface = 'export interface Validators {\n';
            for (let key in validators) {
                let args = validators[key].map((arg, i) => `arg${i}:${arg}`);
                validatorsInterface += `  ${key}(${args.join(',')});\n`;
            }
            validatorsInterface += '}\n';

            let guardsInterface = 'export interface Guards {\n';
            for (let key in guardsMap) {
                let args = guardsMap[key].map((arg, i) => `arg${i}:${arg}`);
                guardsInterface += `  ${key}(${args.join(',')}):Promise<any>;\n`;
            }
            guardsInterface += '}\n';

            //console.log(validatorsInterface);
            compile(schemas, 'MySchema')
                .then(ts => {
                    routes += '}\n';
                    let out=  ts + '\n' + '\n'
                        + validatorsInterface + '\n'
                        + handlersInterface + '\n'
                        + guardsInterface + '\n'
                        + functions + '\n'
                        + routes;
                    resolve(out);
                })
                .catch(reject);
        });

    })
};
export type ElementType = 'dataStructure' | 'member' | 'object' | 'resource';

export interface Element {
    element: ElementType;
    content?: any,// Element[] | {key:any,value:any},
    meta?: {
        id: string
    },
    uriTemplate?: string;
    actions?: any[];
    parent?: any;
}

function parse(input: Element) {
    if (input.element == 'object') {
        parseObject(input);
    } else if (input.element == 'resource') {
        parseResource(input);
    } else if (Array.isArray(input.content)) {
        input.content.forEach(elm => {
            elm.parent = input;
            parse(elm);
        });
    }
}
import { compile, compileFromFile } from 'json-schema-to-typescript'

let schemas = {
    definitions: {},
    allOf: []
};

let validators: any = {};
let handlers: any = {};
let guards: any = {};

let i = 0;
function parseObject(input: Element) {
    if (!input.meta) {
        input.meta = { id: 'Form' + (i++) }
    }

    let schema = {
        title: input.meta.id,
        type: "object",
        properties: {},
        required: []
    }

    let structName = input.meta.id.replace(/\s/g, '');

    let parse = 'export function parse' + structName + '(input:any):' + structName + '{\n   if(!input) return undefined;\n  let output:any = {};\n';
    let validate = 'export function validate' + structName + '(input:' + structName + '){\n     return ';
    let validations = [];

    input.content.map(elm => {
        let key = elm.content.key.content;
        let type = elm.content.value.element;
        let typeName = type.replace(/\s/g, '');
        parse += `   output.${key} = parse${typeName}(input.${key});\n`;
        if (elm.meta) {
            let desc = elm.meta.description;
            if (desc) {
                let array = desc.split('(');
                if (array[1] && array[1].indexOf(')') != -1) {
                    array = array[1].split(')');
                    array = array[0].split(',');
                    array.forEach(val => {
                        val = val.trim();
                        let args = val.split(/\s/g);
                        let method = args[0];
                        args[0] = 'input.' + key;
                        let isValidMethod = 'is' + capitalizeFirstLetter(method);
                        if (validationBuiltins.indexOf(method) != -1) {
                            validations.push(`is.${method}(${args.join(',')})`);
                        } else if (validator[isValidMethod]) {
                            validations.push(`!validator.${isValidMethod}(${args.join(',')})`);
                        } else {
                            validations.push(`validators.${method}(${args.join(',')})`);
                            if (!validators[method]) {
                                validators[method] = args.map(getType);
                                // TEMP
                                validators[method][0] = 'any';
                            }
                        }
                    });
                }
            }
        }

        let isRequired = false;
        if (elm.attributes && elm.attributes.typeAttributes.indexOf('required') != -1) {
            schema.required.push(key);
            isRequired = true;
            let args = ['input.' + key];
            validations.push(`is.required(${args.join(',')})`);
        }

        if (['string', 'number'].indexOf(type) == -1) {
            schema.properties[key] = { $ref: "#/definitions/" + typeName };
            validations.push(isRequired ? `validate${typeName}(input.${key} )` : `( input.${key} ? validate${typeName}(input.${key} ) : false )`);
        } else {
            let prop: any = {
                type,
            }
            schema.properties[key] = prop;

        }
    });
    schemas.definitions[schema.title.replace(/\s/g, '')] = schema;
    schemas.allOf.push({ $ref: "#/definitions/" + schema.title.replace(/\s/g, '') });

    validate += validations.join(' || ') + ';\n}';
    parse += '    return output;\n}\n';
    functions += parse;
    functions += validate;
    return structName;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

let guardsMap: any = {};
function parseResource(input: Element) {

    let category = input.parent.attributes.name || 'global';
    let basepath = input.uriTemplate;

    for (let action of input.actions) {
        let path = basepath;
        if (action.attributes && action.attributes.uriTemplate && path != action.attributes.uriTemplate) {
            path += action.attributes.uriTemplate;
        }
        console.log(action.method, path);
        let desc = action.description.split('\n')[0];
        let array = desc.split('(');
        let guardRun = '';
        if (array[1] && array[1].indexOf(')') != -1) {
            let guards = array[1].split(')')[0].split(',');
            for (let guard of guards) {
                let args = guard.split(/\s/g);

                let method = args[0];
                args[0] = 'ctx';
                guardRun += `let ${method}Guard = await guards.${method}(${args.join(',')});
                            if(${method}Guard) return ${method}Guard\n`;
                if (!guardsMap[method]) {
                    guardsMap[method] = args.map(getType);
                    // TEMP
                    guardsMap[method][0] = 'any';
                }
            }
        }
        let args = [];
        if (action.examples && action.examples[0] && action.examples[0].requests && action.examples[0].requests[0]) {
            let request = action.examples[0].requests[0];
            if (request.content && request.content[0] && request.content[0].element == 'dataStructure') {
                let content = request.content[0].content[0];
                if (content.element == 'object') {
                    let structName = parseObject(content);
                    args = [structName];
                } else {
                    args = [content.element.replace(/\s/g, '')];
                }
            }
        }
        let handlerName = action.name.split(/\s/g).map(capitalizeFirstLetter).join('');
        //console.log('handlerName', action.name, handlerName, path);
        if (!handlerName) handlerName = action.method.toLowerCase() +
            path.split('/').filter(elm => elm)
                .map(elm => elm.replace(/{/g, '')
                    .replace(/}/g, ''))
                .map(capitalizeFirstLetter)
                .join('');
        if (!handlers[category]) handlers[category] = {};
        handlers[category][handlerName] = args;
        routes += `   addRoute('${action.method}','${path}',async(ctx)=>{\n` + guardRun;
        let handlerArgs = ['ctx'];
        args.forEach((arg, i) => {
            routes += `       let arg${i} = parse${arg}(ctx.params);
                    if(validate${arg}(arg${i})) return BadRequest();
            `;
            handlerArgs.push('arg' + i);
        });
        routes += `    return ${category}HandlersInstance.${handlerName}(${handlerArgs.join(',')});
        })\n`;
    }

}


function getType(input: string) {
    return isNumber(input) ? 'number' : 'string';
}

function isNumber(input: string) {
    return parseFloat(input).toString() == input.trim();
}

function isBasicType(input: string) {
    return ['string', 'number'].indexOf(input) != -1;
}