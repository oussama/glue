

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
    email:(input)=>{
        if(!validator.isEmail(input)) return 'must be email';
    }
}


import * as validator from "validator";


export class AbstractRouter {

    addRoute(method:string,path:string,handler:any){
        throw "unimplemented";
    }
    setup(){
        
    }
    addRoutes(){
        addRoutes(this.addRoute);
    }
}

export class ExpressRouter {
    app;
    setup(app){
        this.app = app;
        addRoutes(this);
    }
    addRoute(method:string,path:string,handler:any){
        path = path.replace(/{/g,':').replace(/}/g,'');
        this.app[method.toLowerCase()](path ,function(req,res){
            let params = Object.assign({},req.params);
            params = Object.assign(params,req.body);
            params = Object.assign(params,req.query);
            let ctx = {req,res,params};
            handler(ctx)
            .then(data=>{
                res.status(data.status).send(data.error||data.data);
            })
            .catch(err=>{
                res.status(500).send({message:err.message,stack:err.stack.split("\n")});
            });
        });
        console.log(method,path);
    }
}

import * as querystring from 'querystring';

export class SocketIORouter {
    io;
    setup(io){
        this.io = io;
        io.on('connection', (socket)=> {
            socket.timestamp = {};
            socket.on('disconnect', () => {
                //auth.events.emit('disconnect', socket);
            });

            var params = querystring.parse(socket.request.url.split('?')[1]);
            socket.params = params;
            socket.addRoute = this.addRoute.bind(socket);
            addRoutes(socket);

        });
    }

    addRoute(method,path, handler: Function) {
        let socket:any = this;
        socket.on(method.toLowerCase()+path, (data) => {
            let ctx = {socket,params:Object.assign(socket.params,data)};
            handler(ctx)
            .then(data=>{
                socket.emit(data.__id, data);
            })
            .catch(err=>{
                socket.emit(data.id, { status:500, error: {message:err.message,stack:err.stack.split("\n")} });
            });
        });
    }
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




export let routers = {
    express: new ExpressRouter(),
    socketio: new SocketIORouter()
}

export function setup(_validators:Validators,_guards:Guards){
    validators = _validators;
    guards = _guards;
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

export interface Validators {
              pair(input:any);
  string(input:any);
            }
    export interface Guards {
          authorized(ctx:Context):Promise<any>;

        }
    export interface GetQuestionByIdForm {
      id: number
    }

        export function parseGetQuestionByIdForm(input:any){
            if(!input) return undefined;
            return {
                 id:parsenumber(input.id)
            }
        }
        export function validateGetQuestionByIdForm(input:GetQuestionByIdForm){
            if(input.id != undefined && input.id != null ){
        let err = is.range(input.id,10,100) || validators.pair(input.id,)
        if(err) return 'id: '+err;
        }else{
            return "id is required" ;
        }
        }
    
export interface RegisterForm {
      auth: EmailCreds;
  user: UserInfo
    }

        export function parseRegisterForm(input:any){
            if(!input) return undefined;
            return {
                 auth:parseEmailCreds(input.auth),
 user:parseUserInfo(input.user)
            }
        }
        export function validateRegisterForm(input:RegisterForm){
            
        }
    
export interface ChangePasswordForm {
      current_password: string;
  new_password: string
    }

        export function parseChangePasswordForm(input:any){
            if(!input) return undefined;
            return {
                 current_password:parsestring(input.current_password),
 new_password:parsestring(input.new_password)
            }
        }
        export function validateChangePasswordForm(input:ChangePasswordForm){
            if(input.current_password != undefined && input.current_password != null ){
        let err = is.min(input.current_password,8) || is.max(input.current_password,20)
        if(err) return 'current_password: '+err;
        }else{
            return "current_password is required" ;
        }
if(input.new_password != undefined && input.new_password != null ){
        let err = is.min(input.new_password,8) || is.max(input.new_password,20)
        if(err) return 'new_password: '+err;
        }else{
            return "new_password is required" ;
        }
        }
    
export interface EmailCreds {
      email: string;
  password: string
    }

        export function parseEmailCreds(input:any){
            if(!input) return undefined;
            return {
                 email:parsestring(input.email),
 password:parsestring(input.password)
            }
        }
        export function validateEmailCreds(input:EmailCreds){
            if(input.email != undefined && input.email != null ){
        let err = is.email(input.email,)
        if(err) return 'email: '+err;
        }else{
            return "email is required" ;
        }
if(input.password == undefined || input.password == null )
                return 'password is required';
        }
    
export interface UserInfo {
      first_name: string;
  last_name: string;
  birth_date: string;
  birth_place: string
    }

        export function parseUserInfo(input:any){
            if(!input) return undefined;
            return {
                 first_name:parsestring(input.first_name),
 last_name:parsestring(input.last_name),
 birth_date:parsestring(input.birth_date),
 birth_place:parsestring(input.birth_place)
            }
        }
        export function validateUserInfo(input:UserInfo){
            if(input.first_name != undefined && input.first_name != null ){
        let err = is.min(input.first_name,10) || is.max(input.first_name,100)
        if(err) return 'first_name: '+err;
        }else{
            return "first_name is required" ;
        }
if(input.last_name == undefined || input.last_name == null )
                return 'last_name is required';
if(input.birth_date != undefined && input.birth_date != null ){
        let err = validators.string(input.birth_date,)
        if(err) return 'birth_date: '+err;
        }
        }
    
export interface AuthResponse {
      token: string;
  user_id: number;
  email: EmailCreds
    }

        export function parseAuthResponse(input:any){
            if(!input) return undefined;
            return {
                 token:parsestring(input.token),
 user_id:parsenumber(input.user_id),
 email:parseEmailCreds(input.email)
            }
        }
        export function validateAuthResponse(input:AuthResponse){
            if(input.user_id != undefined && input.user_id != null ){
        let err = is.range(input.user_id,10,100)
        if(err) return 'user_id: '+err;
        }
if(input.email == undefined || input.email == null )
                return 'email is required';
        }
    
let AuthenticationHandlersInstance:AuthenticationHandlers;
    export function setupAuthentication(handler:AuthenticationHandlers){
        AuthenticationHandlersInstance=handler;
    }
    export interface AuthenticationHandlers {
           getQuestionById(ctx:Context,arg0:GetQuestionByIdForm):Promise<Res>;
  register(ctx:Context,arg0:RegisterForm):Promise<Res>;
  login(ctx:Context,arg0:EmailCreds):Promise<Res>;
  changePassword(ctx:Context,arg0:ChangePasswordForm):Promise<Res>;
    }
    export function addRoutes(router){
        router.addRoute('GET','/auth/{question_id}',async(ctx)=>{
                
                let arg0 = parseGetQuestionByIdForm(ctx.params);
                        let validationError = validateGetQuestionByIdForm(arg0);
                        if(validationError) return BadRequest('arg0: '+validationError);
                        
                return AuthenticationHandlersInstance.getQuestionById(ctx,arg0)
            });
router.addRoute('POST','/auth/register',async(ctx)=>{
                
                let arg0 = parseRegisterForm(ctx.params);
                        let validationError = validateRegisterForm(arg0);
                        if(validationError) return BadRequest('arg0: '+validationError);
                        
                return AuthenticationHandlersInstance.register(ctx,arg0)
            });
router.addRoute('POST','/auth/login',async(ctx)=>{
                let authorizedGuard = await guards.authorized(ctx);
                            if(authorizedGuard) return authorizedGuard

                let arg0 = parseEmailCreds(ctx.params);
                        let validationError = validateEmailCreds(arg0);
                        if(validationError) return BadRequest('arg0: '+validationError);
                        
                return AuthenticationHandlersInstance.login(ctx,arg0)
            });
router.addRoute('POST','/auth/password',async(ctx)=>{
                
                let arg0 = parseChangePasswordForm(ctx.params);
                        let validationError = validateChangePasswordForm(arg0);
                        if(validationError) return BadRequest('arg0: '+validationError);
                        
                return AuthenticationHandlersInstance.changePassword(ctx,arg0)
            });;
    }