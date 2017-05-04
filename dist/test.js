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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9PdXNzYW1hL1Byb2plY3RzL2dsdWUvc3JjLyIsInNvdXJjZXMiOlsidGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsaUNBR2dCO0FBR2hCLDBDQUEwQztBQUUxQztJQUNVLFVBQVUsQ0FBQyxHQUFROztZQUNyQixNQUFNLENBQUM7UUFDWCxDQUFDO0tBQUE7Q0FDSjtBQUVEO0lBQ0ksTUFBTSxDQUFDLEtBQVU7UUFDYixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFTO1FBQ1YsRUFBRSxDQUFBLENBQUMsSUFBSSxHQUFDLENBQUMsSUFBRSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3BDLENBQUM7Q0FDSjtBQUVEO0lBRVEsZUFBZSxDQUFDLEdBQVcsRUFBQyxJQUF3Qjs7WUFDdEQsTUFBTSxDQUFDLFNBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBQyxJQUFJLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztRQUM1QixDQUFDO0tBQUE7SUFFSyxRQUFRLENBQUMsR0FBVyxFQUFDLEtBQWtCOztZQUUzQyxNQUFNLENBQUMsU0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLENBQUM7S0FBQTtJQUVLLEtBQUssQ0FBQyxHQUFXLEVBQUMsS0FBZ0I7O1lBQ3BDLE1BQU0sQ0FBQyxlQUFRLEVBQUUsQ0FBQztRQUN0QixDQUFDO0tBQUE7SUFFSyxjQUFjLENBQUMsR0FBVyxFQUFDLEtBQXdCOztZQUN2RCxNQUFNLENBQUMsU0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLENBQUM7S0FBQTtDQUNGO0FBRUQsMEJBQW1CLENBQUMsSUFBSSxvQkFBb0IsRUFBRSxDQUFDLENBQUM7QUFJaEQsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7QUFFdkQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUUxQixjQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixjQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzQixZQUFLLENBQUMsSUFBSSxhQUFhLEVBQUUsRUFBQyxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQUM7QUFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyJ9