#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib = require("./index");
const fs = require("fs");
let outFile = process.argv[3] || './src/glue.ts';
let inFile = process.argv[2];
if (!inFile)
    throw 'Input file required';
lib
    .convert(fs.readFileSync(inFile).toString())
    .then((res) => {
    fs.writeFileSync(outFile, res);
})
    .catch(err => {
    console.log(err);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsicnVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLCtCQUErQjtBQUMvQix5QkFBeUI7QUFFekIsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxlQUFlLENBQUU7QUFDbEQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3QixJQUFHLENBQUMsTUFBTTtJQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHeEMsR0FBRztLQUNGLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQzNDLElBQUksQ0FBQyxDQUFDLEdBQVUsRUFBQyxFQUFFO0lBQ2hCLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQztLQUNELEtBQUssQ0FBQyxHQUFHLENBQUEsRUFBRTtJQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsQ0FBQyxDQUFDLENBQUEifQ==