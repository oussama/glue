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
const express = require("express");
class AppGuards {
    authorized(ctx) {
        throw new Error('Method not implemented.');
    }
}
class AppValidators {
    pair(arg0) {
        if (arg0 % 2 != 0)
            return 'not pair';
    }
}
class AuthenticationRoutes {
    GetQuestionById(ctx, arg0) {
        return __awaiter(this, void 0, void 0, function* () {
            return glue_1.Ok({ id: arg0.id });
        });
    }
    Register(ctx, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return glue_1.Ok('');
        });
    }
    Login(ctx, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return glue_1.NotFound();
        });
    }
    ChangePassword(ctx, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return glue_1.Ok('');
        });
    }
}
glue_1.setupAuthentication(new AuthenticationRoutes());
let app = express();
glue_1.setup(app, new AppValidators(), new AppGuards());
app.listen(4000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9PdXNzYW1hL1Byb2plY3RzL2dsdWUvc3JjLyIsInNvdXJjZXMiOlsidGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsaUNBR2dCO0FBRWhCLG1DQUFtQztBQUVuQztJQUNJLFVBQVUsQ0FBQyxHQUFRO1FBQ2YsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQy9DLENBQUM7Q0FDSjtBQUVEO0lBQ0ksSUFBSSxDQUFDLElBQVM7UUFDVixFQUFFLENBQUEsQ0FBQyxJQUFJLEdBQUMsQ0FBQyxJQUFFLENBQUMsQ0FBQztZQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDcEMsQ0FBQztDQUNKO0FBRUQ7SUFFUSxlQUFlLENBQUMsR0FBVyxFQUFDLElBQVU7O1lBQ3hDLE1BQU0sQ0FBQyxTQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDNUIsQ0FBQztLQUFBO0lBRUssUUFBUSxDQUFDLEdBQVcsRUFBQyxLQUFXOztZQUVwQyxNQUFNLENBQUMsU0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLENBQUM7S0FBQTtJQUVLLEtBQUssQ0FBQyxHQUFXLEVBQUMsS0FBZ0I7O1lBQ3BDLE1BQU0sQ0FBQyxlQUFRLEVBQUUsQ0FBQztRQUN0QixDQUFDO0tBQUE7SUFFSyxjQUFjLENBQUMsR0FBVyxFQUFDLEtBQVc7O1lBQzFDLE1BQU0sQ0FBQyxTQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDaEIsQ0FBQztLQUFBO0NBQ0Y7QUFFRCwwQkFBbUIsQ0FBQyxJQUFJLG9CQUFvQixFQUFFLENBQUMsQ0FBQztBQUNoRCxJQUFJLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUNwQixZQUFLLENBQUMsR0FBRyxFQUFDLElBQUksYUFBYSxFQUFFLEVBQUMsSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMifQ==