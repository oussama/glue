import * as fs from "fs";
import * as validator from "validator";

let drafter = require('drafter.js');


let validationBuiltins = ['min', 'required', 'max', 'range', 'string'];

import * as angular from "./angular";
//let file = fs.readFileSync('./data/test.apib').toString();

export function convert(file: string) {
    return new Promise((resolve, reject) => {

        drafter.parse(file, { type: 'ast' }, function (error, result) {
            if (error) {
                console.log(error);
                return;
            }

            parse(result.ast);



            //console.log(validatorsInterface);
            compile(schemas, 'MySchema')
                .then(ts => {
                    let out = codegen(glue_ast);


                    let ng = angular.codegen(glue_ast);
                    //fs.writeFileSync('./src/GlueService.ts',ng);
                    console.log(out);
                    resolve(out);
                })
                .catch(reject);
        });

    })
};
export type ElementType = 'dataStructure' | 'member' | 'object' | 'resource';

export interface Element {
    element: ElementType;
    name?:string,
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
        parseObject(input,'');
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

import * as ast from "./ast";


import { DataStructure, Property, AST, Route, RouteHandler, RouteGuard } from "./ast";
import { genObject } from "./rust";
import { genRoutes, codegen, getRouteFunction } from "./typescript";
let glue_ast = new AST();

let i = 0;
function parseObject(input: Element,routeName:string) {

    if (!input.meta) {
        input.meta = { id: routeName.split(/\s/g).map(capitalizeFirstLetter).join('')+'Form'  }//(i++) }
    }

    let obj = new DataStructure(input.meta.id);

    let structName = input.meta.id.replace(/\s/g, '');

    let validations = [];
    if(!input.content){
        console.error(input.meta.id,'has no fields');
    }
    input.content.map(elm => {
        let key = elm.content.key.content;
        let type = elm.content.value.element;
        let typeName = type.replace(/\s/g, '');

        let prop = new Property(key, type);
        obj.props.push(prop);

        //   parse += `   output.${key} = parse${typeName}(input.${key});\n`;

        let isRequired = false;
        if (elm.attributes && elm.attributes.typeAttributes.indexOf('required') != -1) {
            prop.required = true;
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
                        args.shift();

                        prop.addValidation(method, ...args);
                        if (!glue_ast.data.validators.find(elm => elm.name == method)) {
                            glue_ast.data.validators.push({ name: method, args: args.map(getType) });
                        }

                    });
                }
            }
        }

    });

    glue_ast.data.objects.push(obj);

    return structName;
}




let routes: Route[] = [];

function parseResource(input: Element) {

    let category = input.parent.attributes.name || 'global';

    console.log(input);
    let route = routes.find(elm => elm.name == category);
    if (!route) {
        route = new Route();
        route.name = category;
        if(input.name && input.name!=category) route.name+=input.name;
    }

    route.name = route.name.replace(/ /g,'');


    let basepath = input.uriTemplate;

    for (let action of input.actions) {

        let path = basepath;
        if (action.attributes && action.attributes.uriTemplate && path != action.attributes.uriTemplate) {
            path += action.attributes.uriTemplate;
        }

        let routeHandler = new RouteHandler(action.name, action.method, path);
        route.handlers.push(routeHandler);

        // parse guards
        let desc = action.description.split('\n')[0];
        let array = desc.split('(');
        let guardRun = '';
        if (array[1] && array[1].indexOf(')') != -1) {
            let guards = array[1].split(')')[0].split(',');
            for (let guard of guards) {
                let args = guard.split(/\s/g);
                let routeGuard = new RouteGuard();
                routeGuard.name = args.shift();
                routeGuard.args = args;
                routeHandler.guards.push(routeGuard);

                if (!glue_ast.data.guards.find(elm => elm.name == routeGuard.name)) {
                    glue_ast.data.guards.push({ name: routeGuard.name, args: args.map(getType) });
                }

            }
        }


        if (action.examples && action.examples[0] && action.examples[0].requests && action.examples[0].requests[0]) {
            let request = action.examples[0].requests[0];
            if (request.content && request.content[0] && request.content[0].element == 'dataStructure') {
                let content = request.content[0].content[0];
                let type;
                if (content.element == 'object') {
                    type = parseObject(content,routeHandler.name);
                } else {
                    type = content.element.replace(/\s/g, '');
                }
                routeHandler.inputs = [{ name: 'arg0', type, kind: 'params' }];

            }
        }

    }

    glue_ast.data.routes.push(route);

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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}