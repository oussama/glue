

export class AST {

    data = {
        validators: [],
        guards: [],
        routes: [],
        objects: []
    }

    constructor() {


    }

    addValidation(name: string, args: string[]) {
        this.data.validators.push({
            name,
            args
        });
    }

}




export class Property {

    validations = [];
    required = false;

    constructor(
        public name: string,
        public type: string
    ) {
        this.type = type.replace(/\s/g,'');
     }

    addValidation(name: string, ...args: string[]) {
        this.validations.push({ name, args });
    }

}

export class DataStructure {
    name: string;
    props = [];

    constructor(
        name: string
    ) {
        this.name = name.replace(/\s/g, '');
    }

}


export function create_validation(name: string, ...args: string[]) {
    return {
        name,
        args
    };
}


export class RouteHandler {

    inputs: RouteInput[] = [];
    guards: RouteGuard[] = [];

    constructor(
        public name: string,
        public method: string,
        public path: string
    ) { }

    addGuard(guard:RouteGuard){
        this.guards.push(guard);
    }

}

export class Route {
    name: string;
    handlers: RouteHandler[] = [];
}


export class RouteGuard {
    name: string;
    args: string[]
}

export class RouteInput {
    name: string;
    type: string;
    kind: string;
}