#!/usr/bin/env tsx
/*If you use a old version of node they used to use what as is called
commonjs by default in all files with .js.  The new version is called esm and i  
changed package.json to use this module(esm). The old function like require and __filename
are no longer available please see this 2 links here for more info about that. 

https://formidable.com/blog/2021/node-esm-and-exports/
https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules

TEMPLATE was switch to tsup and tsx to support the new api I created for templates see here for info on tsup

https://antfu.me/posts/publish-esm-and-cjs


that read  
template.hook.ts
or 
template.hook.js
/* IMPORT */

import {CLI } from '../cli';

/* CLI */

CLI();
