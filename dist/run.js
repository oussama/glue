#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib = require("./index");
const fs = require("fs");
let outFile = process.argv.pop();
let inFile = process.argv.pop();
lib
    .convert(fs.readFileSync(inFile).toString())
    .then((res) => {
    fs.writeFileSync(outFile, res);
})
    .catch(err => {
    console.log(err);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL091c3NhbWEvUHJvamVjdHMvZ2x1ZS9zcmMvIiwic291cmNlcyI6WyJydW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsK0JBQStCO0FBQy9CLHlCQUF5QjtBQUV6QixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFHaEMsR0FBRztLQUNGLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQzNDLElBQUksQ0FBQyxDQUFDLEdBQVU7SUFDYixFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7S0FDRCxLQUFLLENBQUMsR0FBRztJQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsQ0FBQyxDQUFDLENBQUEifQ==