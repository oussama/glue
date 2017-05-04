"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
let protagonist = require('protagonist');
let validationBuiltins = ['min', 'required', 'max', 'range', 'string'];
const angular = require("./angular");
function convert(file) {
    return new Promise((resolve, reject) => {
        protagonist.parse(file, { type: 'ast' }, function (error, result) {
            if (error) {
                console.log(error);
                return;
            }
            parse(result.ast);
            json_schema_to_typescript_1.compile(schemas, 'MySchema')
                .then(ts => {
                let out = typescript_1.codegen(glue_ast);
                let ng = angular.codegen(glue_ast);
                fs.writeFileSync('./src/GlueService.ts', ng);
                console.log(out);
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
        parseObject(input, '');
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
const ast_1 = require("./ast");
const typescript_1 = require("./typescript");
let glue_ast = new ast_1.AST();
let i = 0;
function parseObject(input, routeName) {
    if (!input.meta) {
        input.meta = { id: routeName.split(/\s/g).map(capitalizeFirstLetter).join('') + 'Form' };
    }
    let obj = new ast_1.DataStructure(input.meta.id);
    let structName = input.meta.id.replace(/\s/g, '');
    let validations = [];
    input.content.map(elm => {
        let key = elm.content.key.content;
        let type = elm.content.value.element;
        let typeName = type.replace(/\s/g, '');
        let prop = new ast_1.Property(key, type);
        obj.props.push(prop);
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
let routes = [];
function parseResource(input) {
    let category = input.parent.attributes.name || 'global';
    let route = routes.find(elm => elm.name == category);
    if (!route) {
        route = new ast_1.Route();
        route.name = category;
    }
    let basepath = input.uriTemplate;
    for (let action of input.actions) {
        let path = basepath;
        if (action.attributes && action.attributes.uriTemplate && path != action.attributes.uriTemplate) {
            path += action.attributes.uriTemplate;
        }
        let routeHandler = new ast_1.RouteHandler(action.name, action.method, path);
        route.handlers.push(routeHandler);
        let desc = action.description.split('\n')[0];
        let array = desc.split('(');
        let guardRun = '';
        if (array[1] && array[1].indexOf(')') != -1) {
            let guards = array[1].split(')')[0].split(',');
            for (let guard of guards) {
                let args = guard.split(/\s/g);
                let routeGuard = new ast_1.RouteGuard();
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
                    type = parseObject(content, routeHandler.name);
                }
                else {
                    type = content.element.replace(/\s/g, '');
                }
                routeHandler.inputs = [{ name: 'arg0', type, kind: 'params' }];
            }
        }
    }
    glue_ast.data.routes.push(route);
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
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvT3Vzc2FtYS9Qcm9qZWN0cy9nbHVlL3NyYy8iLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBR3pCLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUd6QyxJQUFJLGtCQUFrQixHQUFHLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRXZFLHFDQUFxQztBQUdyQyxpQkFBd0IsSUFBWTtJQUNoQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtRQUUvQixXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxVQUFVLEtBQUssRUFBRSxNQUFNO1lBQzVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbkIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFLbEIsbUNBQU8sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO2lCQUN2QixJQUFJLENBQUMsRUFBRTtnQkFDSixJQUFJLEdBQUcsR0FBRyxvQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUc1QixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNuQyxFQUFFLENBQUMsYUFBYSxDQUFDLHNCQUFzQixFQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsQ0FBQyxDQUFDO2lCQUNE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