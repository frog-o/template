#!/usr/local/bin/node
import { execSync as exec } from 'child_process';
import { existsSync } from 'fs';
let userEmail = '47947111+frog-o@users.noreply.github.com';
if (existsSync('/usr/bin/git')) {
  exec('git config user.email --global\ "' + userEmail + '"');
  exec('git config user.email "' + userEmail + '"');
  
  console.log('Ran ok');
}
exec('yarn install');
