"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
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
            res.status(500).send({message:err.message,stack:err.stack.split("\\n")});
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

export let NotFound = (message?:any)=> Err(message|| 'not found',404);
export let Unauthorized = (message?:any)=> Err(message|| 'unauthorized',401);
export let BadRequest = (message?:any)=> Err(message|| 'bad request',400);
export let Forbidden = (message?:any)=> Err(message|| 'forbidden',403);

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
function convert(file) {
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
                let instanceName = `${category}HandlersInstance`;
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
            json_schema_to_typescript_1.compile(schemas, 'MySchema')
                .then(ts => {
                routes += '}\n';
                let out = ts + '\n' + '\n'
                    + validatorsInterface + '\n'
                    + handlersInterface + '\n'
                    + guardsInterface + '\n'
                    + functions + '\n'
                    + routes;
                resolve(out);
            })
                .catch(reject);
        });
    });
}
exports.convert = convert;
;
function parse(input) {
    if (input.element == 'object') {
        parseObject(input);
    }
    else if (input.element == 'resource') {
        parseResource(input);
    }
    else if (Array.isArray(input.content)) {
        input.content.forEach(elm => {
            elm.parent = input;
            parse(elm);
        });
    }
}
const json_schema_to_typescript_1 = require("json-schema-to-typescript");
let schemas = {
    definitions: {},
    allOf: []
};
let validators = {};
let handlers = {};
let guards = {};
let i = 0;
function parseObject(input) {
    if (!input.meta) {
        input.meta = { id: 'Form' + (i++) };
    }
    let schema = {
        title: input.meta.id,
        type: "object",
        properties: {},
        required: []
    };
    let structName = input.meta.id.replace(/\s/g, '');
    let parse = 'export function parse' + structName + '(input:any):' + structName + '{\n   if(!input) return undefined;\n  let output:any = {};\n';
    let validate = 'export function validate' + structName + '(input:' + structName + '){\n     return ';
    let validations = [];
    input.content.map(elm => {
        let key = elm.content.key.content;
        let type = elm.content.value.element;
        let typeName = type.replace(/\s/g, '');
        parse += `   output.${key} = parse${typeName}(input.${key});\n`;
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
        }
        else {
            let prop = {
                type,
            };
            schema.properties[key] = prop;
        }
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
                        }
                        else if (validator[isValidMethod]) {
                            validations.push(`!validator.${isValidMethod}(${args.join(',')})`);
                        }
                        else {
                            validations.push(`validators.${method}(${args.join(',')})`);
                            if (!validators[method]) {
                                validators[method] = args.map(getType);
                                validators[method][0] = 'any';
                            }
                        }
                    });
                }
            }
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
let guardsMap = {};
function parseResource(input) {
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
                }
                else {
                    args = [content.element.replace(/\s/g, '')];
                }
            }
        }
        let handlerName = action.name.split(/\s/g).map(capitalizeFirstLetter).join('');
        if (!handlerName)
            handlerName = action.method.toLowerCase() +
                path.split('/').filter(elm => elm)
                    .map(elm => elm.replace(/{/g, '')
                    .replace(/}/g, ''))
                    .map(capitalizeFirstLetter)
                    .join('');
        if (!handlers[category])
            handlers[category] = {};
        handlers[category][handlerName] = args;
        routes += `   addRoute('${action.method}','${path}',async(ctx)=>{\n` + guardRun;
        let handlerArgs = ['ctx'];
        args.forEach((arg, i) => {
            routes += `       let arg${i} = parse${arg}(ctx.params);
                    let validationError = validate${arg}(arg${i});
                    if(validationError) return BadRequest(validationError);
            `;
            handlerArgs.push('arg' + i);
        });
        routes += `    return ${category}HandlersInstance.${handlerName}(${handlerArgs.join(',')});
        })\n`;
    }
}
function getType(input) {
    return isNumber(input) ? 'number' : 'string';
}
function isNumber(input) {
    return parseFloat(input).toString() == input.trim();
}
function isBasicType(input) {
    return ['string', 'number'].indexOf(input) != -1;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvT3Vzc2FtYS9Qcm9qZWN0cy9nbHVlL3NyYy8iLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdUNBQXVDO0FBRXZDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUd6QyxJQUFJLGtCQUFrQixHQUFHLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZFLElBQUksTUFBTSxHQUFHOztDQUVaLENBQUM7QUFFRixJQUFJLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQW9HZixDQUFDO0FBR0YsaUJBQXdCLElBQVk7SUFDaEMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07UUFFL0IsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsVUFBVSxLQUFLLEVBQUUsTUFBTTtZQUM1RCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRWxCLElBQUksaUJBQWlCLEdBQUcsRUFBRSxDQUFDO1lBQzNCLElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQztZQUMzQixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLENB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