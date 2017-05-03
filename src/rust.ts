

import { DataStructure } from "./ast";

function genPropValidation(prop:any){
    let out = '';
    if(prop.validations.length){
        
        if(!prop.required){
            out+= `if let Some(val) = input.${prop.name} {\n`;
        }else{
            out+= `let val = &input.${prop.name}\n`;
        }
        out+=`${prop.validations.map(v=>
            `is.${v.name}(val,${v.args.join(',')})?;`)}\n`;
        if(!prop.required){
            out+= `}`;
        }
    }
    return out;
}

//    let obj:Type = serde_json::from_str(data)?;
export function genObject(obj: DataStructure) {
    let out = genStruct(obj);
    if(obj.props.map(prop=>prop.validations.length).reduce((a,b)=>a+b)>0){
        out+=`pub fn validate_${obj.name.toLowerCase()}(input:${obj.name}){
            ${ obj.props.map(genPropValidation).filter(elm=>elm).join('\n')}
        }`
    };
    return out;
}


let typeMap = (input)=> {
    return {string:'String',
    number:'f32'}[input] || input;
}

export function genStruct(obj:DataStructure){
    return `#[derive(Debug,Serialize,Deserialize)]
    pub struct ${obj.name} {
        ${obj.props.map(prop=>
            `  ${prop.name}: ${prop.required? typeMap(prop.type) : `Option<${typeMap(prop.type)}>` }`).join(';\n')}
    }\n`;
}