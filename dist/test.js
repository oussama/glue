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
const bodyParser = require("body-parser");
class AppGuards {
    authorized(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
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
app.use(bodyParser.json());
glue_1.setup(app, new AppValidators(), new AppGuards());
app.listen(4000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9PdXNzYW1hL1Byb2plY3RzL2dsdWUvc3JjLyIsInNvdXJjZXMiOlsidGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsaUNBR2dCO0FBRWhCLG1DQUFtQztBQUNuQywwQ0FBMEM7QUFFMUM7SUFDVSxVQUFVLENBQUMsR0FBUTs7WUFDckIsTUFBTSxDQUFDO1FBQ1gsQ0FBQztLQUFBO0NBQ0o7QUFFRDtJQUNJLElBQUksQ0FBQyxJQUFTO1FBQ1YsRUFBRSxDQUFBLENBQUMsSUFBSSxHQUFDLENBQUMsSUFBRSxDQUFDLENBQUM7WUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3BDLENBQUM7Q0FDSjtBQUVEO0lBRVEsZUFBZSxDQUFDLEdBQVcsRUFBQyxJQUFVOztZQUN4QyxNQUFNLENBQUMsU0FBRSxDQUFDLEVBQUMsRUFBRSxFQUFDLElBQUksQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDO1FBQzVCLENBQUM7S0FBQTtJQUVLLFFBQVEsQ0FBQyxHQUFXLEVBQUMsS0FBVzs7WUFFcEMsTUFBTSxDQUFDLFNBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoQixDQUFDO0tBQUE7SUFFSyxLQUFLLENBQUMsR0FBVyxFQUFDLEtBQWdCOztZQUNwQyxNQUFNLENBQUMsZUFBUSxFQUFFLENBQUM7UUFDdEIsQ0FBQztLQUFBO0lBRUssY0FBYyxDQUFDLEdBQVcsRUFBQyxLQUFXOztZQUMxQyxNQUFNLENBQUMsU0FBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLENBQUM7S0FBQTtDQUNGO0FBRUQsMEJBQW1CLENBQUMsSUFBSSxvQkFBb0IsRUFBRSxDQUFDLENBQUM7QUFDaEQsSUFBSSxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7QUFDcEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUMxQixZQUFLLENBQUMsR0FBRyxFQUFDLElBQUksYUFBYSxFQUFFLEVBQUMsSUFBSSxTQUFTLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMifQ==