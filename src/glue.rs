


pub #[derive(Debug)]
enum Error {
    Required(String),
    Variant2,
}


pub fn max(name:String,input:f32,val:f32) -> Result<(),String> {
    input>val ? Err(format!("{} max should be {}",name,val)) : Ok(())
}

pub fn validate_sometype(arg: SomeType) -> Result<(),String> {
    max(arg.count)?   
}