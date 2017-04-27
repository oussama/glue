#!/usr/bin/env node

import * as lib from './index';
import * as fs from 'fs';

let outFile = process.argv[3] || './src/glue.ts' ;
let inFile = process.argv[2];
if(!inFile) throw 'Input file required';


lib
.convert(fs.readFileSync(inFile).toString())
.then((res:string)=>{
    fs.writeFileSync(outFile,res);
})
.catch(err=>{
    console.log(err);
})
