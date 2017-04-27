"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
let AuthenticationHandlersInstance;
function setupAuthentication(handler) {
    AuthenticationHandlersInstance = handler;
}
exports.setupAuthentication = setupAuthentication;
let is = {
    required: (input) => {
        if (input == undefined || input == null || input == '')
            return 'required';
    },
    range: (input, min, max) => {
        if (input < min || input > max)
            return 'out of range';
    },
    min: (input, min) => {
        if (input < min)
            return 'less than min ' + min;
    },
    max: (input, max) => {
        if (input > max)
            return 'greater than max ' + max;
    },
    string: (input) => {
        if (typeof input != 'string')
            return 'must be string';
    },
};
const validator = require("validator");
function addRoute(method, path, handler) {
    path = path.replace(/{/g, ':').replace(/}/g, '');
    _app[method.toLowerCase()](path, function (req, res) {
        let params = Object.assign({}, req.params);
        params = Object.assign(params, req.body);
        params = Object.assign(params, req.query);
        let ctx = { req, res, params };
        handler(ctx)
            .then(data => {
            res.status(data.status).send(data.error || data.data);
        })
            .catch(err => {
            res.status(500).send({ message: err.message, stack: err.stack.split("\n") });
        });
    });
    console.log(method, path);
}
function Ok(data, status = 200) {
    return {
        error: null,
        data,
        status,
    };
}
exports.Ok = Ok;
function Err(error, status = 500) {
    return {
        error,
        data: null,
        status,
    };
}
exports.Err = Err;
exports.NotFound = (message) => Err(message || 'not found', 404);
exports.Unauthorized = (message) => Err(message || 'unauthorized', 401);
exports.BadRequest = (message) => Err(message || 'bad request', 400);
exports.Forbidden = (message) => Err(message || 'forbidden', 403);
let validators;
let guards;
function _setup(_validators, _guards) {
    validators = _validators;
    guards = _guards;
}
function setup(app, validators, guards) {
    _app = app;
    addRoutes();
    _setup(validators, guards);
}
exports.setup = setup;
function parsestring(input) {
    if (input == undefined || input == null)
        return undefined;
    return input.toString();
}
exports.parsestring = parsestring;
function parsenumber(input) {
    if (input == undefined || input == null)
        return undefined;
    return parseFloat(input);
}
exports.parsenumber = parsenumber;
function parseboolean(input) {
    if (input == undefined || input == null)
        return undefined;
    return Boolean(input);
}
exports.parseboolean = parseboolean;
function parseForm0(input) {
    if (!input)
        return undefined;
    let output = {};
    output.id = parsenumber(input.id);
    return output;
}
exports.parseForm0 = parseForm0;
function validateForm0(input) {
    return is.required(input.id) || is.range(input.id, 10, 100) || validators.pair(input.id);
}
exports.validateForm0 = validateForm0;
function parseForm1(input) {
    if (!input)
        return undefined;
    let output = {};
    output.auth = parseEmailCreds(input.auth);
    output.user = parseUserInfo(input.user);
    return output;
}
exports.parseForm1 = parseForm1;
function validateForm1(input) {
    return (input.auth ? validateEmailCreds(input.auth) : false) || (input.user ? validateUserInfo(input.user) : false);
}
exports.validateForm1 = validateForm1;
function parseForm2(input) {
    if (!input)
        return undefined;
    let output = {};
    output.current_password = parsestring(input.current_password);
    output.new_password = parsestring(input.new_password);
    return output;
}
exports.parseForm2 = parseForm2;
function validateForm2(input) {
    return is.required(input.current_password) || is.min(input.current_password, 8) || is.max(input.current_password, 20) || is.required(input.new_password) || is.min(input.new_password, 8) || is.max(input.new_password, 20);
}
exports.validateForm2 = validateForm2;
function parseEmailCreds(input) {
    if (!input)
        return undefined;
    let output = {};
    output.email = parsestring(input.email);
    output.password = parsestring(input.password);
    return output;
}
exports.parseEmailCreds = parseEmailCreds;
function validateEmailCreds(input) {
    return is.required(input.email) || !validator.isEmail(input.email) || is.required(input.password);
}
exports.validateEmailCreds = validateEmailCreds;
function parseUserInfo(input) {
    if (!input)
        return undefined;
    let output = {};
    output.first_name = parsestring(input.first_name);
    output.last_name = parsestring(input.last_name);
    output.birth_date = parsestring(input.birth_date);
    output.birth_place = parsestring(input.birth_place);
    return output;
}
exports.parseUserInfo = parseUserInfo;
function validateUserInfo(input) {
    return is.required(input.first_name) || is.min(input.first_name, 10) || is.max(input.first_name, 100) || is.required(input.last_name) || is.string(input.birth_date);
}
exports.validateUserInfo = validateUserInfo;
function parseAuthResponse(input) {
    if (!input)
        return undefined;
    let output = {};
    output.token = parsestring(input.token);
    output.user_id = parsenumber(input.user_id);
    output.email = parseEmailCreds(input.email);
    return output;
}
exports.parseAuthResponse = parseAuthResponse;
function validateAuthResponse(input) {
    return is.range(input.user_id, 10, 100) || is.required(input.email) || validateEmailCreds(input.email);
}
exports.validateAuthResponse = validateAuthResponse;
let _app;
function addRoutes() {
    addRoute('GET', '/auth/{question_id}', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let arg0 = parseForm0(ctx.params);
        let validationError = validateForm0(arg0);
        if (validationError)
            return exports.BadRequest(validationError);
        return AuthenticationHandlersInstance.GetQuestionById(ctx, arg0);
    }));
    addRoute('POST', '/auth/register', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let arg0 = parseForm1(ctx.params);
        let validationError = validateForm1(arg0);
        if (validationError)
            return exports.BadRequest(validationError);
        return AuthenticationHandlersInstance.Register(ctx, arg0);
    }));
    addRoute('POST', '/auth/login', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let authorizedGuard = yield guards.authorized(ctx);
        if (authorizedGuard)
            return authorizedGuard;
        let arg0 = parseEmailCreds(ctx.params);
        let validationError = validateEmailCreds(arg0);
        if (validationError)
            return exports.BadRequest(validationError);
        return AuthenticationHandlersInstance.Login(ctx, arg0);
    }));
    addRoute('POST', '/auth/password', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let arg0 = parseForm2(ctx.params);
        let validationError = validateForm2(arg0);
        if (validationError)
            return exports.BadRequest(validationError);
        return AuthenticationHandlersInstance.ChangePassword(ctx, arg0);
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2x1ZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9PdXNzYW1hL1Byb2plY3RzL2dsdWUvc3JjLyIsInNvdXJjZXMiOlsiZ2x1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBc0NBLElBQUksOEJBQXFELENBQUM7QUFPbEQsNkJBQW9DLE9BQThCO0lBQzlELDhCQUE4QixHQUFDLE9BQU8sQ0FBQztBQUMzQyxDQUFDO0FBRkQsa0RBRUM7QUFRVCxJQUFJLEVBQUUsR0FBRztJQUNMLFFBQVEsRUFBQyxDQUFDLEtBQUs7UUFDWCxFQUFFLENBQUEsQ0FBQyxLQUFLLElBQUUsU0FBUyxJQUFJLEtBQUssSUFBRSxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDekUsQ0FBQztJQUNELEtBQUssRUFBQyxDQUFDLEtBQUssRUFBQyxHQUFHLEVBQUMsR0FBRztRQUNoQixFQUFFLENBQUEsQ0FBQyxLQUFLLEdBQUMsR0FBRyxJQUFJLEtBQUssR0FBQyxHQUFHLENBQUM7WUFBQyxNQUFNLENBQUMsY0FBYyxDQUFDO0lBQ3JELENBQUM7SUFDRCxHQUFHLEVBQUMsQ0FBQyxLQUFLLEVBQUMsR0FBRztRQUNWLEVBQUUsQ0FBQSxDQUFDLEtBQUssR0FBQyxHQUFHLENBQUM7WUFBQyxNQUFNLENBQUMsZ0JBQWdCLEdBQUMsR0FBRyxDQUFDO0lBQzlDLENBQUM7SUFDRCxHQUFHLEVBQUMsQ0FBQyxLQUFLLEVBQUMsR0FBRztRQUNULEVBQUUsQ0FBQSxDQUFDLEtBQUssR0FBQyxHQUFHLENBQUM7WUFBQyxNQUFNLENBQUMsbUJBQW1CLEdBQUMsR0FBRyxDQUFDO0lBQ2xELENBQUM7SUFDRCxNQUFNLEVBQUMsQ0FBQyxLQUFLO1FBQ1IsRUFBRSxDQUFBLENBQUMsT0FBTyxLQUFLLElBQUcsUUFBUSxDQUFDO1lBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0lBQ3pELENBQUM7Q0FDSixDQUFBO0FBR0Qs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