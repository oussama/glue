"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AST {
    constructor() {
        this.data = {
            validators: [],
            guards: [],
            routes: [],
            objects: []
        };
    }
    addValidation(name, args) {
        this.data.validators.push({
            name,
            args
        });
    }
}
exports.AST = AST;
class Property {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.validations = [];
        this.required = false;
        this.type = type.replace(/\s/g, '');
    }
    addValidation(name, ...args) {
        this.validations.push({ name, args });
    }
}
exports.Property = Property;
class DataStructure {
    constructor(name) {
        this.props = [];
        this.name = name.replace(/\s/g, '');
    }
}
exports.DataStructure = DataStructure;
function create_validation(name, ...args) {
    return {
        name,
        args
    };
}
exports.create_validation = create_validation;
class RouteHandler {
    constructor(name, method, path) {
        this.name = name;
        this.method = method;
        this.path = path;
        this.inputs = [];
        this.guards = [];
    }
    addGuard(guard) {
        this.guards.push(guard);
    }
}
exports.RouteHandler = RouteHandler;
class Route {
    constructor() {
        this.handlers = [];
    }
}
exports.Route = Route;
class RouteGuard {
}
exports.RouteGuard = RouteGuard;
class RouteInput {
}
exports.RouteInput = RouteInput;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiYXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBYSxHQUFHO0lBU1o7UUFQQSxTQUFJLEdBQUc7WUFDSCxVQUFVLEVBQUUsRUFBRTtZQUNkLE1BQU0sRUFBRSxFQUFFO1lBQ1YsTUFBTSxFQUFFLEVBQUU7WUFDVixPQUFPLEVBQUUsRUFBRTtTQUNkLENBQUE7SUFLRCxDQUFDO0lBRUQsYUFBYSxDQUFDLElBQVksRUFBRSxJQUFjO1FBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztZQUN0QixJQUFJO1lBQ0osSUFBSTtTQUNQLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FFSjtBQXJCRCxrQkFxQkM7QUFLRCxNQUFhLFFBQVE7SUFLakIsWUFDVyxJQUFZLEVBQ1osSUFBWTtRQURaLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBTHZCLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFNYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRixhQUFhLENBQUMsSUFBWSxFQUFFLEdBQUcsSUFBYztRQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FFSjtBQWhCRCw0QkFnQkM7QUFFRCxNQUFhLGFBQWE7SUFJdEIsWUFDSSxJQUFZO1FBSGhCLFVBQUssR0FBRyxFQUFFLENBQUM7UUFLUCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FFSjtBQVZELHNDQVVDO0FBR0QsU0FBZ0IsaUJBQWlCLENBQUMsSUFBWSxFQUFFLEdBQUcsSUFBYztJQUM3RCxPQUFPO1FBQ0gsSUFBSTtRQUNKLElBQUk7S0FDUCxDQUFDO0FBQ04sQ0FBQztBQUxELDhDQUtDO0FBR0QsTUFBYSxZQUFZO0lBS3JCLFlBQ1csSUFBWSxFQUNaLE1BQWMsRUFDZCxJQUFZO1FBRlosU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxTQUFJLEdBQUosSUFBSSxDQUFRO1FBTnZCLFdBQU0sR0FBaUIsRUFBRSxDQUFDO1FBQzFCLFdBQU0sR0FBaUIsRUFBRSxDQUFDO0lBTXRCLENBQUM7SUFFTCxRQUFRLENBQUMsS0FBZ0I7UUFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQztDQUVKO0FBZkQsb0NBZUM7QUFFRCxNQUFhLEtBQUs7SUFBbEI7UUFFSSxhQUFRLEdBQW1CLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0NBQUE7QUFIRCxzQkFHQztBQUdELE1BQWEsVUFBVTtDQUd0QjtBQUhELGdDQUdDO0FBRUQsTUFBYSxVQUFVO0NBSXRCO0FBSkQsZ0NBSUMifQ==