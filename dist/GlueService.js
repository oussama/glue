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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2x1ZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiQzovVXNlcnMvT3Vzc2FtYS9Qcm9qZWN0cy9nbHVlL3NyYy8iLCJzb3VyY2VzIjpbIkdsdWVTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsd0NBQXlFO0FBQ3pFLGdEQUEyRDtBQUMzRCxnQkFBYztBQUNkLDZEQUEwRDtBQUUxRDtJQUlJLFlBQW9CLElBQVU7UUFBVixTQUFJLEdBQUosSUFBSSxDQUFNO1FBRjlCLG1CQUFjLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUlqRCxVQUFLLEdBQUcsRUFBRSxDQUFDO0lBRnVCLENBQUM7SUFJbkMsYUFBYSxDQUFDLE9BQU87UUFDakIsSUFBSSxPQUFPLEdBQUcsSUFBSSxjQUFPLEVBQUUsQ0FBQztRQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hELE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFLO1FBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDO2FBQzlCLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUs7UUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMseUJBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7YUFDdEQsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsV0FBVyxDQUFDLEdBQWEsRUFBRSxNQUFNO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwQixNQUFNLENBQUMsdUJBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixDQUFDO1FBQ0QsTUFBTSxDQUFDLHVCQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSztRQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1QixJQUFJLE1BQU0sR0FBRyxJQUFJLHNCQUFlLEVBQUUsQ0FBQztRQUNuQyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDMUIsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQzdCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUNELElBQUksT0FBTyxHQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3RELENBQUM7Q0FFSjtBQS9DRCxrQ0ErQ0M7QUFrQ0Q7SUFDSSxZQUFvQixPQUFvQjtRQUFwQixZQUFPLEdBQVAsT0FBTyxDQUFhO0lBQUksQ0FBQztJQUU3QyxlQUFlLENBQUMsSUFBeUI7UUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxxQkFBcUIsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUNoRSxDQUFDO0lBQ0QsUUFBUSxDQUFDLElBQWtCO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDNUQsQ0FBQztJQUNELEtBQUssQ0FBQyxJQUFnQjtRQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUN6RCxDQUFDO0lBQ0QsY0FBYyxDQUFDLElBQXdCO1FBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDNUQsQ0FBQztDQUNKO0FBZkQsc0RBZUMifQ==