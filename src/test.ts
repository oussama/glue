import {
    AuthenticationHandlers,setupAuthentication,
    Guards, Validators, Context, Form1, Form0, Ok, Err, NotFound, EmailCreds, Res, setup
} from './glue';

import * as express from "express";
import * as bodyParser from "body-parser";

class AppGuards implements Guards {
    async authorized(ctx: any) {
        return;
    }
}

class AppValidators implements Validators {
    pair(arg0: any) {
        if(arg0%2!=0) return 'not pair';
    }
}

class AuthenticationRoutes implements AuthenticationHandlers {

  async GetQuestionById(ctx:Context,arg0:Form0){
      return Ok({id:arg0.id});
  }
  
  async Register(ctx:Context,input:Form0){
      
    return Ok('');
  }

  async Login(ctx:Context,input:EmailCreds){
      return NotFound();
  }

  async ChangePassword(ctx:Context,input:Form1){
    return Ok('');
  }
}

setupAuthentication(new AuthenticationRoutes());
let app = express();
app.use(bodyParser.json())
setup(app,new AppValidators(),new AppGuards());
app.listen(4000);