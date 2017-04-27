#!/usr/bin/env node

import * as lib from './index';
import * as fs from 'fs';

let outFile = process.argv.pop();
let inFile = process.argv.pop();


lib
.convert(fs.readFileSync(inFile).toString())
.then((res:string)=>{
    fs.writeFileSync(outFile,res);
})
.catch(err=>{
    console.log(err);
})
