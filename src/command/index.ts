

export { create } from "./create"
export { update } from "./update"
export { wizard } from "./wizard"
export { install } from "./install"
export { uninstall } from "./uninstall"

import  Utils  from '../utils';
import {create, update,
    wizard,
    install ,
    uninstall, 
    } from '../command';
export async function generate(template: string, pathToOutput?: string)
    {/* We have a config4 generator built-in.  The main reason generator where made is to handle the problem
    of every program wanting there version of package manager( yarn ,pnpm,npm), Until this feature was add you would keep having to put 
    "packageManager": "pnpm@7.2.1" or what ever package manager your want in package.json, delete there lock files and other
    annoying things over and over ,this feature attempts to solve all that by just running
    
    template gen config4 defaults
    */  
      if (pathToOutput !== undefined)  
      {return create(template, pathToOutput);}
        
    }
  export async function list () {

    const names = await Utils.templates.getNames ();

    if ( !names.length ) {

      console.log ( 'No templates installed' );

    } else {

      names.forEach ( name => console.log ( name ) );

    }

  }
export const templateManger ={create, 
update,
 wizard,
 install ,
 uninstall, 
 generate,
 list
}
export default templateManger
  