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
    email: (input) => {
        if (!validator.isEmail(input))
            return 'must be email';
    }
};
const validator = require("validator");
class AbstractRouter {
    addRoute(method, path, handler) {
        throw "unimplemented";
    }
    setup() {
    }
    addRoutes() {
        addRoutes(this.addRoute);
    }
}
exports.AbstractRouter = AbstractRouter;
class ExpressRouter {
    setup(app) {
        this.app = app;
        addRoutes(this);
    }
    addRoute(method, path, handler) {
        path = path.replace(/{/g, ':').replace(/}/g, '');
        this.app[method.toLowerCase()](path, function (req, res) {
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
}
exports.ExpressRouter = ExpressRouter;
const querystring = require("querystring");
class SocketIORouter {
    setup(io) {
        this.io = io;
        io.on('connection', (socket) => {
            socket.timestamp = {};
            socket.on('disconnect', () => {
            });
            var params = querystring.parse(socket.request.url.split('?')[1]);
            socket.params = params;
            socket.addRoute = this.addRoute.bind(socket);
            addRoutes(socket);
        });
    }
    addRoute(method, path, handler) {
        let socket = this;
        socket.on(method.toLowerCase() + path, (data) => {
            let ctx = { socket, params: Object.assign(socket.params, data) };
            handler(ctx)
                .then(data => {
                socket.emit(data.__id, data);
            })
                .catch(err => {
                socket.emit(data.id, { status: 500, error: { message: err.message, stack: err.stack.split("\n") } });
            });
        });
    }
}
exports.SocketIORouter = SocketIORouter;
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
exports.routers = {
    express: new ExpressRouter(),
    socketio: new SocketIORouter()
};
function setup(_validators, _guards) {
    validators = _validators;
    guards = _guards;
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
function parseGetQuestionByIdForm(input) {
    if (!input)
        return undefined;
    return {
        id: parsenumber(input.id)
    };
}
exports.parseGetQuestionByIdForm = parseGetQuestionByIdForm;
function validateGetQuestionByIdForm(input) {
    if (input.id != undefined && input.id != null) {
        let err = is.range(input.id, 10, 100) || validators.pair(input.id);
        if (err)
            return 'id: ' + err;
    }
    else {
        return "id is required";
    }
}
exports.validateGetQuestionByIdForm = validateGetQuestionByIdForm;
function parseRegisterForm(input) {
    if (!input)
        return undefined;
    return {
        auth: parseEmailCreds(input.auth),
        user: parseUserInfo(input.user)
    };
}
exports.parseRegisterForm = parseRegisterForm;
function validateRegisterForm(input) {
}
exports.validateRegisterForm = validateRegisterForm;
function parseChangePasswordForm(input) {
    if (!input)
        return undefined;
    return {
        current_password: parsestring(input.current_password),
        new_password: parsestring(input.new_password)
    };
}
exports.parseChangePasswordForm = parseChangePasswordForm;
function validateChangePasswordForm(input) {
    if (input.current_password != undefined && input.current_password != null) {
        let err = is.min(input.current_password, 8) || is.max(input.current_password, 20);
        if (err)
            return 'current_password: ' + err;
    }
    else {
        return "current_password is required";
    }
    if (input.new_password != undefined && input.new_password != null) {
        let err = is.min(input.new_password, 8) || is.max(input.new_password, 20);
        if (err)
            return 'new_password: ' + err;
    }
    else {
        return "new_password is required";
    }
}
exports.validateChangePasswordForm = validateChangePasswordForm;
function parseEmailCreds(input) {
    if (!input)
        return undefined;
    return {
        email: parsestring(input.email),
        password: parsestring(input.password)
    };
}
exports.parseEmailCreds = parseEmailCreds;
function validateEmailCreds(input) {
    if (input.email != undefined && input.email != null) {
        let err = is.email(input.email);
        if (err)
            return 'email: ' + err;
    }
    else {
        return "email is required";
    }
    if (input.password == undefined || input.password == null)
        return 'password is required';
}
exports.validateEmailCreds = validateEmailCreds;
function parseUserInfo(input) {
    if (!input)
        return undefined;
    return {
        first_name: parsestring(input.first_name),
        last_name: parsestring(input.last_name),
        birth_date: parsestring(input.birth_date),
        birth_place: parsestring(input.birth_place)
    };
}
exports.parseUserInfo = parseUserInfo;
function validateUserInfo(input) {
    if (input.first_name != undefined && input.first_name != null) {
        let err = is.min(input.first_name, 10) || is.max(input.first_name, 100);
        if (err)
            return 'first_name: ' + err;
    }
    else {
        return "first_name is required";
    }
    if (input.last_name == undefined || input.last_name == null)
        return 'last_name is required';
    if (input.birth_date != undefined && input.birth_date != null) {
        let err = validators.string(input.birth_date);
        if (err)
            return 'birth_date: ' + err;
    }
}
exports.validateUserInfo = validateUserInfo;
function parseAuthResponse(input) {
    if (!input)
        return undefined;
    return {
        token: parsestring(input.token),
        user_id: parsenumber(input.user_id),
        email: parseEmailCreds(input.email)
    };
}
exports.parseAuthResponse = parseAuthResponse;
function validateAuthResponse(input) {
    if (input.user_id != undefined && input.user_id != null) {
        let err = is.range(input.user_id, 10, 100);
        if (err)
            return 'user_id: ' + err;
    }
    if (input.email == undefined || input.email == null)
        return 'email is required';
}
exports.validateAuthResponse = validateAuthResponse;
let AuthenticationHandlersInstance;
function setupAuthentication(handler) {
    AuthenticationHandlersInstance = handler;
}
exports.setupAuthentication = setupAuthentication;
function addRoutes(router) {
    router.addRoute('GET', '/auth/{question_id}', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let arg0 = parseGetQuestionByIdForm(ctx.params);
        let validationError = validateGetQuestionByIdForm(arg0);
        if (validationError)
            return exports.BadRequest('arg0: ' + validationError);
        return AuthenticationHandlersInstance.getQuestionById(ctx, arg0);
    }));
    router.addRoute('POST', '/auth/register', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let arg0 = parseRegisterForm(ctx.params);
        let validationError = validateRegisterForm(arg0);
        if (validationError)
            return exports.BadRequest('arg0: ' + validationError);
        return AuthenticationHandlersInstance.register(ctx, arg0);
    }));
    router.addRoute('POST', '/auth/login', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let authorizedGuard = yield guards.authorized(ctx);
        if (authorizedGuard)
            return authorizedGuard;
        let arg0 = parseEmailCreds(ctx.params);
        let validationError = validateEmailCreds(arg0);
        if (validationError)
            return exports.BadRequest('arg0: ' + validationError);
        return AuthenticationHandlersInstance.login(ctx, arg0);
    }));
    router.addRoute('POST', '/auth/password', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let arg0 = parseChangePasswordForm(ctx.params);
        let validationError = validateChangePasswordForm(arg0);
        if (validationError)
            return exports.BadRequest('arg0: ' + validationError);
        return AuthenticationHandlersInstance.changePassword(ctx, arg0);
    }));
    ;
}
exports.addRoutes = addRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2x1ZS5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbImdsdWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBLElBQUksRUFBRSxHQUFHO0lBQ0wsUUFBUSxFQUFDLENBQUMsS0FBSyxFQUFDLEVBQUU7UUFDZCxJQUFHLEtBQUssSUFBRSxTQUFTLElBQUksS0FBSyxJQUFFLElBQUksSUFBSSxLQUFLLElBQUksRUFBRTtZQUFFLE9BQU8sVUFBVSxDQUFDO0lBQ3pFLENBQUM7SUFDRCxLQUFLLEVBQUMsQ0FBQyxLQUFLLEVBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxFQUFFO1FBQ25CLElBQUcsS0FBSyxHQUFDLEdBQUcsSUFBSSxLQUFLLEdBQUMsR0FBRztZQUFFLE9BQU8sY0FBYyxDQUFDO0lBQ3JELENBQUM7SUFDRCxHQUFHLEVBQUMsQ0FBQyxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7UUFDYixJQUFHLEtBQUssR0FBQyxHQUFHO1lBQUUsT0FBTyxnQkFBZ0IsR0FBQyxHQUFHLENBQUM7SUFDOUMsQ0FBQztJQUNELEdBQUcsRUFBQyxDQUFDLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtRQUNaLElBQUcsS0FBSyxHQUFDLEdBQUc7WUFBRSxPQUFPLG1CQUFtQixHQUFDLEdBQUcsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsTUFBTSxFQUFDLENBQUMsS0FBSyxFQUFDLEVBQUU7UUFDWCxJQUFHLE9BQU8sS0FBSyxJQUFHLFFBQVE7WUFBRSxPQUFPLGdCQUFnQixDQUFDO0lBQ3pELENBQUM7SUFDRCxLQUFLLEVBQUMsQ0FBQyxLQUFLLEVBQUMsRUFBRTtRQUNYLElBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztZQUFFLE9BQU8sZUFBZSxDQUFDO0lBQ3pELENBQUM7Q0FDSixDQUFBO0FBR0QsdUNBQXVDO0FBR3ZDLE1BQWEsY0FBYztJQUV2QixRQUFRLENBQUMsTUFBYSxFQUFDLElBQVcsRUFBQyxP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