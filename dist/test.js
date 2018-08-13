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
const glue_1 = require("./glue");
const bodyParser = require("body-parser");
class AppGuards {
    authorized(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
}
class AppValidators {
    string(input) {
        throw new Error('Method not implemented.');
    }
    pair(arg0) {
        if (arg0 % 2 != 0)
            return 'not pair';
    }
}
class AuthenticationRoutes {
    getQuestionById(ctx, arg0) {
        return __awaiter(this, void 0, void 0, function* () {
            return glue_1.Ok({ id: arg0.id });
        });
    }
    register(ctx, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return glue_1.Ok('');
        });
    }
    login(ctx, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return glue_1.NotFound();
        });
    }
    changePassword(ctx, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return glue_1.Ok('');
        });
    }
}
glue_1.setupAuthentication(new AuthenticationRoutes());
let app = require('express')();
let server = require('http').Server(app);
let io = require('socket.io')(server, { path: '/ws' });
app.use(bodyParser.json());
glue_1.routers.express.setup(app);
glue_1.routers.socketio.setup(io);
glue_1.setup(new AppValidators(), new AppGuards());
server.listen(4000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGlDQUdnQjtBQUdoQiwwQ0FBMEM7QUFFMUMsTUFBTSxTQUFTO0lBQ0wsVUFBVSxDQUFDLEdBQVE7O1lBQ3JCLE9BQU87UUFDWCxDQUFDO0tBQUE7Q0FDSjtBQUVELE1BQU0sYUFBYTtJQUNmLE1BQU0sQ0FBQyxLQUFVO1FBQ2IsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxJQUFJLENBQUMsSUFBUztRQUNWLElBQUcsSUFBSSxHQUFDLENBQUMsSUFBRSxDQUFDO1lBQUUsT0FBTyxVQUFVLENBQUM7SUFDcEMsQ0FBQztDQUNKO0FBRUQsTUFBTSxvQkFBb0I7SUFFbEIsZUFBZSxDQUFDLEdBQVcsRUFBQyxJQUF3Qjs7WUFDdEQsT0FBTyxTQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDNUIsQ0FBQztLQUFBO0lBRUssUUFBUSxDQUFDLEdBQVcsRUFBQyxLQUFrQjs7WUFFM0MsT0FBTyxTQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsQ0FBQztLQUFBO0lBRUssS0FBSyxDQUFDLEdBQVcsRUFBQyxLQUFnQjs7WUFDcEMsT0FBTyxlQUFRLEVBQUUsQ0FBQztRQUN0QixDQUFDO0tBQUE7SUFFSyxjQUFjLENBQUMsR0FBVyxFQUFDLEtBQXdCOztZQUN2RCxPQUFPLFNBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQixDQUFDO0tBQUE7Q0FDRjtBQUVELDBCQUFtQixDQUFDLElBQUksb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO0FBSWhELElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBRXZELEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7QUFFMUIsY0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsY0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0IsWUFBSyxDQUFDLElBQUksYUFBYSxFQUFFLEVBQUMsSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMifQ==