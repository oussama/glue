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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuLmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL091c3NhbWEvUHJvamVjdHMvZ2x1ZS9zcmMvIiwic291cmNlcyI6WyJydW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsK0JBQStCO0FBQy9CLHlCQUF5QjtBQUV6QixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLGVBQWUsQ0FBRTtBQUNsRCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLEVBQUUsQ0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUd4QyxHQUFHO0tBQ0YsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDM0MsSUFBSSxDQUFDLENBQUMsR0FBVTtJQUNiLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQztLQUNELEtBQUssQ0FBQyxHQUFHO0lBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixDQUFDLENBQUMsQ0FBQSJ9