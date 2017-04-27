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
                    if(validate${arg}(arg${i})) return BadRequest();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvT3Vzc2FtYS9Qcm9qZWN0cy9nbHVlL3NyYy8iLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdUNBQXVDO0FBRXZDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUd6QyxJQUFJLGtCQUFrQixHQUFHLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZFLElBQUksTUFBTSxHQUFHOztDQUVaLENBQUM7QUFFRixJQUFJLFNBQVMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0EyR2YsQ0FBQztBQUdGLGlCQUF3QixJQUFZO0lBQ2hDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1FBRS9CLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLFVBQVUsS0FBSyxFQUFFLE1BQU07WUFDNUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuQixNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVsQixJQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztZQUMzQixJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUM7WUFDM0IsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEs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