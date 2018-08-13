"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("@angular/http");
const Observable_1 = require("rxjs/Observable");
require("rxjs");
const environment_1 = require("../environments/environment");
class GlueService {
    constructor(http) {
        this.http = http;
        this.authentication = new AuthenticationService(this);
        this.token = '';
    }
    beforeRequest(options) {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'Bearer ' + this.token);
        options.headers = headers;
    }
    json(method, path, body) {
        return this.api(method, path, body)
            .map(res => res.json());
    }
    api(method, path, body) {
        return this.request(environment_1.environment.apiURL, method, path, body)
            .catch(this.handleError);
    }
    handleError(res, caught) {
        if (res.status == 401) {
            return Observable_1.Observable.empty();
        }
        return Observable_1.Observable.throw(res);
    }
    request(apiURL, method, action, body) {
        console.log(method, action);
        var search = new http_1.URLSearchParams();
        if (body && method == 'GET') {
            for (var key in body) {
                if (body.hasOwnProperty(key)) {
                    var element = body[key];
                    search.set(key, element);
                }
            }
        }
        let options = { method, search, body };
        this.beforeRequest(options);
        return this.http.request(apiURL + action, options);
    }
}
exports.GlueService = GlueService;
class AuthenticationService {
    constructor(service) {
        this.service = service;
    }
    getQuestionById(arg0) {
        return this.service.json('get', '/auth/{question_id}', arg0);
    }
    register(arg0) {
        return this.service.json('post', '/auth/register', arg0);
    }
    login(arg0) {
        return this.service.json('post', '/auth/login', arg0);
    }
    changePassword(arg0) {
        return this.service.json('post', '/auth/password', arg0);
    }
}
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2x1ZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJHbHVlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHdDQUF5RTtBQUN6RSxnREFBMkQ7QUFDM0QsZ0JBQWM7QUFDZCw2REFBMEQ7QUFFMUQsTUFBYSxXQUFXO0lBSXBCLFlBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBRjlCLG1CQUFjLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUlqRCxVQUFLLEdBQUcsRUFBRSxDQUFDO0lBRnVCLENBQUM7SUFJbkMsYUFBYSxDQUFDLE9BQU87UUFDakIsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hELE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFLO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQzthQUM5QixHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSztRQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7YUFDdEQsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsV0FBVyxDQUFDLEdBQWEsRUFBRSxNQUFNO1FBQzdCLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLEVBQUU7WUFDbkIsT0FBTyx1QkFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQzdCO1FBQ0QsT0FBTyx1QkFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUs7UUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxzQkFBZSxFQUFFLENBQUM7UUFDbkMsSUFBSSxJQUFJLElBQUksTUFBTSxJQUFJLEtBQUssRUFBRTtZQUN6QixLQUFLLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtnQkFDbEIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUMxQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2lCQUM1QjthQUNKO1NBQ0o7UUFDRCxJQUFJLE9BQU8sR0FBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDdEQsQ0FBQztDQUVKO0FBL0NELGtDQStDQztBQWtDRCxNQUFhLHFCQUFxQjtJQUM5QixZQUFvQixPQUFvQjtRQUFwQixZQUFPLEdBQVAsT0FBTyxDQUFhO0lBQUksQ0FBQztJQUU3QyxlQUFlLENBQUMsSUFBeUI7UUFDckMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDaEUsQ0FBQztJQUNELFFBQVEsQ0FBQyxJQUFrQjtRQUN2QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUM1RCxDQUFDO0lBQ0QsS0FBSyxDQUFDLElBQWdCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUN6RCxDQUFDO0lBQ0QsY0FBYyxDQUFDLElBQXdCO1FBQ25DLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFBO0lBQzVELENBQUM7Q0FDSjtBQWZELHNEQWVDIn0=