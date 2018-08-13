"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function genPropValidation(prop) {
    let out = '';
    if (prop.validations.length) {
        if (!prop.required) {
            out += `if let Some(val) = input.${prop.name} {\n`;
        }
        else {
            out += `let val = &input.${prop.name}\n`;
        }
        out += `${prop.validations.map(v => `is.${v.name}(val,${v.args.join(',')})?;`)}\n`;
        if (!prop.required) {
            out += `}`;
        }
    }
    return out;
}
function genObject(obj) {
    let out = genStruct(obj);
    if (obj.props.map(prop => prop.validations.length).reduce((a, b) => a + b) > 0) {
        out += `pub fn validate_${obj.name.toLowerCase()}(input:${obj.name}){
            ${obj.props.map(genPropValidation).filter(elm => elm).join('\n')}
        }`;
    }
    ;
    return out;
}
exports.genObject = genObject;
let typeMap = (input) => {
    return { string: 'String',
        number: 'f32' }[input] || input;
};
function genStruct(obj) {
    return `#[derive(Debug,Serialize,Deserialize)]
    pub struct ${obj.name} {
        ${obj.props.map(prop => `  ${prop.name}: ${prop.required ? typeMap(prop.type) : `Option<${typeMap(prop.type)}>`}`).join(';\n')}
    }\n`;
}
exports.genStruct = genStruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVzdC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInJ1c3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxTQUFTLGlCQUFpQixDQUFDLElBQVE7SUFDL0IsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsSUFBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBQztRQUV2QixJQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQztZQUNkLEdBQUcsSUFBRyw0QkFBNEIsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDO1NBQ3JEO2FBQUk7WUFDRCxHQUFHLElBQUcsb0JBQW9CLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztTQUMzQztRQUNELEdBQUcsSUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQSxFQUFFLENBQzVCLE1BQU0sQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUNuRCxJQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQztZQUNkLEdBQUcsSUFBRyxHQUFHLENBQUM7U0FDYjtLQUNKO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBR0QsU0FBZ0IsU0FBUyxDQUFDLEdBQWtCO0lBQ3hDLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QixJQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQSxFQUFFLENBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQSxDQUFDLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFDO1FBQ2pFLEdBQUcsSUFBRSxtQkFBbUIsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsVUFBVSxHQUFHLENBQUMsSUFBSTtjQUN6RCxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUEsRUFBRSxDQUFBLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7VUFDakUsQ0FBQTtLQUNMO0lBQUEsQ0FBQztJQUNGLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQztBQVJELDhCQVFDO0FBR0QsSUFBSSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUMsRUFBRTtJQUNuQixPQUFPLEVBQUMsTUFBTSxFQUFDLFFBQVE7UUFDdkIsTUFBTSxFQUFDLEtBQUssRUFBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQztBQUNsQyxDQUFDLENBQUE7QUFFRCxTQUFnQixTQUFTLENBQUMsR0FBaUI7SUFDdkMsT0FBTztpQkFDTSxHQUFHLENBQUMsSUFBSTtVQUNmLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQSxFQUFFLENBQ2xCLEtBQUssSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMxRyxDQUFDO0FBQ1QsQ0FBQztBQU5ELDhCQU1DIn0=