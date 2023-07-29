#!/usr/local/bin/node
import {execSync as exec} from 'child_process');
let userEmail = '47947111+frog-o@users.noreply.github.com';

exec('git config user.email --global "' + userEmail + '"');
console.log("Ran ok")
exec('yarn intsall')