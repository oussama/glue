export interface Form0 {
    id: number;
    [k: string]: any;
}
export interface Form1 {
    auth?: EmailCreds;
    user?: UserInfo;
    [k: string]: any;
}
export interface EmailCreds {
    email: string;
    password: string;
    [k: string]: any;
}
export interface UserInfo {
    first_name: string;
    last_name: string;
    birth_date?: string;
    birth_place?: string;
    [k: string]: any;
}
export interface Form2 {
    current_password: string;
    new_password: string;
    [k: string]: any;
}
export interface AuthResponse {
    token?: string;
    user_id?: number;
    email: EmailCreds;
    [k: string]: any;
}


export interface Validators {
    pair(arg0: any);
}

let AuthenticationHandlersInstance: AuthenticationHandlers;
export interface AuthenticationHandlers {
    GetQuestionById(ctx: Context, arg0: Form0): Promise<Res>;
    Register(ctx: Context, arg0: Form1): Promise<Res>;
    Login(ctx: Context, arg0: EmailCreds): Promise<Res>;
    ChangePassword(ctx: Context, arg0: Form2): Promise<Res>;
}
export function setupAuthentication(handler: AuthenticationHandlers) {
    AuthenticationHandlersInstance = handler;
}

export interface Guards {
    authorized(arg0: any): Promise<any>;
}



let is = {
    required: (input) => {
        if (input == undefined || input == null || input == '') return 'required';
    },
    range: (input, min, max) => {
        if (input < min || input > max) return 'out of range';
    },
    min: (input, min) => {
        if (input < min) return 'less than min ' + min;
    },
    max: (input, max) => {
        if (input > max) return 'greater than max ' + max;
    },
    string: (input) => {
        if (typeof input != 'string') return 'must be string';
    },
}


import * as validator from "validator";

function addRoute(method: string, path: string, handler: any) {
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
export interface Error extends Res {
    data?: any;
    error?: string;
    status: number;
}
export interface Res {
    data?: any;
    error?: string;
    status: number;
}
export function Ok(data: any, status: number = 200): Res {
    return {
        error: null,
        data,
        status,
    }
}
export function Err(error?: string, status: number = 500): Res {
    return {
        error,
        data: null,
        status,
    }
}

export function NotFound(message?: string) {
    return Err(message || 'not found', 404);
}

export function Forbidden(message?: string) {
    return Err(message || 'forbidden', 404);
}

export function BadRequest(message?: string) {
    return Err(message || 'bad request', 401);
}

export interface Context {

}

let validators: Validators;
let guards: Guards;

function _setup(_validators: Validators, _guards: Guards) {
    validators = _validators;
    guards = _guards;
}
export function setup(app, validators: Validators, guards: Guards) {
    _app = app;
    addRoutes();
    _setup(validators, guards);
}


export function parsestring(input: any) {
    if (input == undefined || input == null) return undefined;
    return input.toString();
}
export function parsenumber(input: any) {
    if (input == undefined || input == null) return undefined;
    return parseFloat(input);
}
export function parseboolean(input: any) {
    if (input == undefined || input == null) return undefined;
    return Boolean(input);
}
export function parseForm0(input: any): Form0 {
    if (!input) return undefined;
    let output: any = {};
    output.id = parsenumber(input.id);
    return output;
}
export function validateForm0(input: Form0) {
    return is.range(input.id, 10, 100) || validators.pair(input.id) || is.required(input.id);
} export function parseForm1(input: any): Form1 {
    if (!input) return undefined;
    let output: any = {};
    output.auth = parseEmailCreds(input.auth);
    output.user = parseUserInfo(input.user);
    return output;
}
export function validateForm1(input: Form1) {
    return (input.auth ? validateEmailCreds(input.auth) : false) || (input.user ? validateUserInfo(input.user) : false);
} export function parseForm2(input: any): Form2 {
    if (!input) return undefined;
    let output: any = {};
    output.current_password = parsestring(input.current_password);
    output.new_password = parsestring(input.new_password);
    return output;
}
export function validateForm2(input: Form2) {
    return is.min(input.current_password, 8) || is.max(input.current_password, 20) || is.required(input.current_password) || is.min(input.new_password, 8) || is.max(input.new_password, 20) || is.required(input.new_password);
} export function parseEmailCreds(input: any): EmailCreds {
    if (!input) return undefined;
    let output: any = {};
    output.email = parsestring(input.email);
    output.password = parsestring(input.password);
    return output;
}
export function validateEmailCreds(input: EmailCreds) {
    return !validator.isEmail(input.email) || is.required(input.email) || is.required(input.password);
} export function parseUserInfo(input: any): UserInfo {
    if (!input) return undefined;
    let output: any = {};
    output.first_name = parsestring(input.first_name);
    output.last_name = parsestring(input.last_name);
    output.birth_date = parsestring(input.birth_date);
    output.birth_place = parsestring(input.birth_place);
    return output;
}
export function validateUserInfo(input: UserInfo) {
    return is.min(input.first_name, 10) || is.max(input.first_name, 100) || is.required(input.first_name) || is.required(input.last_name) || is.string(input.birth_date);
} export function parseAuthResponse(input: any): AuthResponse {
    if (!input) return undefined;
    let output: any = {};
    output.token = parsestring(input.token);
    output.user_id = parsenumber(input.user_id);
    output.email = parseEmailCreds(input.email);
    return output;
}
export function validateAuthResponse(input: AuthResponse) {
    return is.range(input.user_id, 10, 100) || is.required(input.email) || validateEmailCreds(input.email);
}
let _app;
function addRoutes() {
    addRoute('GET', '/auth/{question_id}', async (ctx) => {
        let arg0 = parseForm0(ctx.params);
        if (validateForm0(arg0)) return BadRequest();
        return AuthenticationHandlersInstance.GetQuestionById(ctx, arg0);
    })
    addRoute('POST', '/auth/register', async (ctx) => {
        let arg0 = parseForm1(ctx.params);
        if (validateForm1(arg0)) return BadRequest();
        return AuthenticationHandlersInstance.Register(ctx, arg0);
    })
    addRoute('POST', '/auth/login', async (ctx) => {
        let authorizedGuard = await guards.authorized(ctx);
        if (authorizedGuard) return authorizedGuard
        let arg0 = parseEmailCreds(ctx.params);
        if (validateEmailCreds(arg0)) return BadRequest();
        return AuthenticationHandlersInstance.Login(ctx, arg0);
    })
    addRoute('POST', '/auth/password', async (ctx) => {
        let arg0 = parseForm2(ctx.params);
        if (validateForm2(arg0)) return BadRequest();
        return AuthenticationHandlersInstance.ChangePassword(ctx, arg0);
    })
}
