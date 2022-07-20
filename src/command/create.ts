import Config from '../config';
import  Utils  from '../utils';
import  generator  from "../middleware"
import * as path from 'path';
import  { default as Metalsmith } from 'metalsmith';
import * as fs from 'fs';
import ask from 'inquirer-helpers';
import { TemplateManager as Template } from '..';



export class  templateCreate {
async create ( templateName: string, pathToOutput?: string ,doNotDelete  =false) {

    pathToOutput = pathToOutput || `my-${templateName}`;
    
  let source = Utils.template.getPath (templateName)
  /*This is very tricky to get right in esm script 
  *process.cwd() is null when launch in vscode and
  *when running from package.json script , returns the wrong path
  *process.env['INIT_CWD'] work but only when running
  *with pnpm or equivalent package manager here is a person with similar problems
  *https://stackoverflow.com/questions/31414852/process-env-pwd-vs-process-cwd
  \*************************************************************/ 
  const dest = path.join ( String(process.env.PWD), pathToOutput );
  
    
  if ( !source ) {return console.error ( `"${templateName}" is not a valid template` );}
  //check for backward compatibility in new version not used except when you 
  //you want to put thing in your TNTConf.d directory.
  if (Utils.template.hasTemplateDir(source)){source = path.join(source,'template')}

  if ( fs.existsSync ( dest ) && doNotDelete === false) {

    const okay = await ask.noYes ( `There's already a file or folder named "${pathToOutput}", do you want to overwrite it?` );

    if ( !okay ) return;
              
          //await Utils.delete ( dest );  

  }

  if ( Config.autoUpdate ) await Template.update ( templateName );

  const ms = Metalsmith (new URL('.', import.meta.url).pathname );
  ms.use(generator)
  
  Utils.handlebars.useHelpers();


  ms.clean ( !doNotDelete )
    .frontmatter ( false )
    .source ( source )
    .destination ( dest )
    .build ( err => {
      if ( err ) throw err;
    });

  console.log ( `Created "${dest}"` );

}
}
