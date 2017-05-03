import {
    AuthenticationHandlers,setupAuthentication,
    Guards, Validators, Context, Ok, Err, NotFound, EmailCreds, Res, setup, RegisterForm, GetQuestionByIdForm, ChangePasswordForm, routers
} from './glue';

import * as express from "express";
import * as bodyParser from "body-parser";

class AppGuards implements Guards {
    async authorized(ctx: any) {
        return;
    }
}

class AppValidators implements Validators {
    string(input: any) {
        throw new Error('Method not implemented.');
    }

    pair(arg0: any) {
        if(arg0%2!=0) return 'not pair';
    }
}

class AuthenticationRoutes implements AuthenticationHandlers {

  async GetQuestionById(ctx:Context,arg0:GetQuestionByIdForm){
      return Ok({id:arg0.id});
  }
  
  async Register(ctx:Context,input:RegisterForm){
      
    return Ok('');
  }

  async Login(ctx:Context,input:EmailCreds){
      return NotFound();
  }

  async ChangePassword(ctx:Context,input:ChangePasswordForm){
    return Ok('');
  }
}

setupAuthentication(new AuthenticationRoutes());

import * as http from "http";

let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server, { path: '/ws' });

app.use(bodyParser.json())

routers.express.setup(app);
routers.socketio.setup(io);
setup(new AppValidators(),new AppGuards());
server.listen(4000);