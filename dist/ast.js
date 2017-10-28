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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN0LmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL291c3NhL3dvcmsvZ2x1ZS9zcmMvIiwic291cmNlcyI6WyJhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTtJQVNJO1FBUEEsU0FBSSxHQUFHO1lBQ0gsVUFBVSxFQUFFLEVBQUU7WUFDZCxNQUFNLEVBQUUsRUFBRTtZQUNWLE1BQU0sRUFBRSxFQUFFO1lBQ1YsT0FBTyxFQUFFLEVBQUU7U0FDZCxDQUFBO0lBS0QsQ0FBQztJQUVELGFBQWEsQ0FBQyxJQUFZLEVBQUUsSUFBYztRQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDdEIsSUFBSTtZQUNKLElBQUk7U0FDUCxDQUFDLENBQUM7SUFDUCxDQUFDO0NBRUo7QUFyQkQsa0JBcUJDO0FBS0Q7SUFLSSxZQUNXLElBQVksRUFDWixJQUFZO1FBRFosU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLFNBQUksR0FBSixJQUFJLENBQVE7UUFMdkIsZ0JBQVcsR0FBRyxFQUFFLENBQUM7UUFDakIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQU1iLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVGLGFBQWEsQ0FBQyxJQUFZLEVBQUUsR0FBRyxJQUFjO1FBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDMUMsQ0FBQztDQUVKO0FBaEJELDRCQWdCQztBQUVEO0lBSUksWUFDSSxJQUFZO1FBSGhCLFVBQUssR0FBRyxFQUFFLENBQUM7UUFLUCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FFSjtBQVZELHNDQVVDO0FBR0QsMkJBQWtDLElBQVksRUFBRSxHQUFHLElBQWM7SUFDN0QsTUFBTSxDQUFDO1FBQ0gsSUFBSTtRQUNKLElBQUk7S0FDUCxDQUFDO0FBQ04sQ0FBQztBQUxELDhDQUtDO0FBR0Q7SUFLSSxZQUNXLElBQVksRUFDWixNQUFjLEVBQ2QsSUFBWTtRQUZaLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsU0FBSSxHQUFKLElBQUksQ0FBUTtRQU52QixXQUFNLEdBQWlCLEVBQUUsQ0FBQztRQUMxQixXQUFNLEdBQWlCLEVBQUUsQ0FBQztJQU10QixDQUFDO0lBRUwsUUFBUSxDQUFDLEtBQWdCO1FBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FFSjtBQWZELG9DQWVDO0FBRUQ7SUFBQTtRQUVJLGFBQVEsR0FBbUIsRUFBRSxDQUFDO0lBQ2xDLENBQUM7Q0FBQTtBQUhELHNCQUdDO0FBR0Q7Q0FHQztBQUhELGdDQUdDO0FBRUQ7Q0FJQztBQUpELGdDQUlDIn0=