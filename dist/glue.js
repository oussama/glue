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
            res.status(500).send(err);
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
function NotFound(message) {
    return Err(message || 'not found', 404);
}
exports.NotFound = NotFound;
function Forbidden(message) {
    return Err(message || 'forbidden', 404);
}
exports.Forbidden = Forbidden;
function BadRequest(message) {
    return Err(message || 'bad request', 401);
}
exports.BadRequest = BadRequest;
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
    return is.range(input.id, 10, 100) || validators.pair(input.id) || is.required(input.id);
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
    return is.min(input.current_password, 8) || is.max(input.current_password, 20) || is.required(input.current_password) || is.min(input.new_password, 8) || is.max(input.new_password, 20) || is.required(input.new_password);
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
    return !validator.isEmail(input.email) || is.required(input.email) || is.required(input.password);
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
    return is.min(input.first_name, 10) || is.max(input.first_name, 100) || is.required(input.first_name) || is.required(input.last_name) || is.string(input.birth_date);
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
        if (validateForm0(arg0))
            return BadRequest();
        return AuthenticationHandlersInstance.GetQuestionById(ctx, arg0);
    }));
    addRoute('POST', '/auth/register', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let arg0 = parseForm1(ctx.params);
        if (validateForm1(arg0))
            return BadRequest();
        return AuthenticationHandlersInstance.Register(ctx, arg0);
    }));
    addRoute('POST', '/auth/login', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let authorizedGuard = yield guards.authorized(ctx);
        if (authorizedGuard)
            return authorizedGuard;
        let arg0 = parseEmailCreds(ctx.params);
        if (validateEmailCreds(arg0))
            return BadRequest();
        return AuthenticationHandlersInstance.Login(ctx, arg0);
    }));
    addRoute('POST', '/auth/password', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let arg0 = parseForm2(ctx.params);
        if (validateForm2(arg0))
            return BadRequest();
        return AuthenticationHandlersInstance.ChangePassword(ctx, arg0);
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2x1ZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9PdXNzYW1hL1Byb2plY3RzL2dsdWUvc3JjLyIsInNvdXJjZXMiOlsiZ2x1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBc0NBLElBQUksOEJBQXNELENBQUM7QUFPM0QsNkJBQW9DLE9BQStCO0lBQy9ELDhCQUE4QixHQUFHLE9BQU8sQ0FBQztBQUM3QyxDQUFDO0FBRkQsa0RBRUM7QUFRRCxJQUFJLEVBQUUsR0FBRztJQUNMLFFBQVEsRUFBRSxDQUFDLEtBQUs7UUFDWixFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksU0FBUyxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUUsQ0FBQztZQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDOUUsQ0FBQztJQUNELEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRztRQUNuQixFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7WUFBQyxNQUFNLENBQUMsY0FBYyxDQUFDO0lBQzFELENBQUM7SUFDRCxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNaLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7WUFBQyxNQUFNLENBQUMsZ0JBQWdCLEdBQUcsR0FBRyxDQUFDO0lBQ25ELENBQUM7SUFDRCxHQUFHLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNaLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7WUFBQyxNQUFNLENBQUMsbUJBQW1CLEdBQUcsR0FBRyxDQUFDO0lBQ3RELENBQUM7SUFDRCxNQUFNLEVBQUUsQ0FBQyxLQUFLO1FBQ1YsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLElBQUksUUFBUSxDQUFDO1lBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0lBQzFELENBQUM7Q0FDSixDQUFBO0FBR0Qs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