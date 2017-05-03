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
        return AuthenticationHandlersInstance.GetQuestionById(ctx, arg0);
    }));
    router.addRoute('POST', '/auth/register', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let arg0 = parseRegisterForm(ctx.params);
        let validationError = validateRegisterForm(arg0);
        if (validationError)
            return exports.BadRequest('arg0: ' + validationError);
        return AuthenticationHandlersInstance.Register(ctx, arg0);
    }));
    router.addRoute('POST', '/auth/login', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let authorizedGuard = yield guards.authorized(ctx);
        if (authorizedGuard)
            return authorizedGuard;
        let arg0 = parseEmailCreds(ctx.params);
        let validationError = validateEmailCreds(arg0);
        if (validationError)
            return exports.BadRequest('arg0: ' + validationError);
        return AuthenticationHandlersInstance.Login(ctx, arg0);
    }));
    router.addRoute('POST', '/auth/password', (ctx) => __awaiter(this, void 0, void 0, function* () {
        let arg0 = parseChangePasswordForm(ctx.params);
        let validationError = validateChangePasswordForm(arg0);
        if (validationError)
            return exports.BadRequest('arg0: ' + validationError);
        return AuthenticationHandlersInstance.ChangePassword(ctx, arg0);
    }));
    ;
}
exports.addRoutes = addRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2x1ZS5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9PdXNzYW1hL1Byb2plY3RzL2dsdWUvc3JjLyIsInNvdXJjZXMiOlsiZ2x1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsSUFBSSxFQUFFLEdBQUc7SUFDTCxRQUFRLEVBQUMsQ0FBQyxLQUFLO1FBQ1gsRUFBRSxDQUFBLENBQUMsS0FBSyxJQUFFLFNBQVMsSUFBSSxLQUFLLElBQUUsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFLENBQUM7WUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3pFLENBQUM7SUFDRCxLQUFLLEVBQUMsQ0FBQyxLQUFLLEVBQUMsR0FBRyxFQUFDLEdBQUc7UUFDaEIsRUFBRSxDQUFBLENBQUMsS0FBSyxHQUFDLEdBQUcsSUFBSSxLQUFLLEdBQUMsR0FBRyxDQUFDO1lBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztJQUNyRCxDQUFDO0lBQ0QsR0FBRyxFQUFDLENBQUMsS0FBSyxFQUFDLEdBQUc7UUFDVixFQUFFLENBQUEsQ0FBQyxLQUFLLEdBQUMsR0FBRyxDQUFDO1lBQUMsTUFBTSxDQUFDLGdCQUFnQixHQUFDLEdBQUcsQ0FBQztJQUM5QyxDQUFDO0lBQ0QsR0FBRyxFQUFDLENBQUMsS0FBSyxFQUFDLEdBQUc7UUFDVCxFQUFFLENBQUEsQ0FBQyxLQUFLLEdBQUMsR0FBRyxDQUFDO1lBQUMsTUFBTSxDQUFDLG1CQUFtQixHQUFDLEdBQUcsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsTUFBTSxFQUFDLENBQUMsS0FBSztRQUNSLEVBQUUsQ0FBQSxDQUFDLE9BQU8sS0FBSyxJQUFHLFFBQVEsQ0FBQztZQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUN6RCxDQUFDO0lBQ0QsS0FBSyxFQUFDLENBQUMsS0FBSztRQUNSLEVBQUUsQ0FBQSxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxlQUFlLENB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