import Config from '../config';
import  Utils  from '../utils';
import  { generator} from "../middleware/generator"
import * as path from 'path';
import  { default as Metalsmith } from 'metalsmith';
import * as fs from 'fs';
import ask from 'inquirer-helpers';
import  TemplateManager  from '../command';
import { metalSmithData } from '../middleware/types/metalsmith';
import { createOption } from './types';



export async function create ( templateName: string, pathToOutput: string =`my-${templateName}`,options ?:createOption) {
  
  const merge= options?.merge ?? false 
  
  
    
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
  
  
  if ( fs.existsSync ( dest ) && merge === false) {

    const okay = await ask.noYes ( `There's already a file or folder named "${pathToOutput}", do you want to overwrite it?` );

    if ( !okay ) return;
   
  }

  if ( Config.autoUpdate ) await TemplateManager.update ( templateName );

  const ms = Metalsmith (new URL('.', import.meta.url).pathname );


  const msData: metalSmithData={}
  if(options !== undefined)
  {msData.options=options}
  
  ms.metadata(msData)
  ms.use(generator)
  
  Utils.handlebars.useHelpers();


  ms.clean ( !merge && ((msData?.options?.dryRun === undefined)? false:msData.options.dryRun ))
    .frontmatter ( false )
    .source ( source )
    .destination ( dest )
    .build ( err => {
      if ( err ) throw err;
    });

  console.log ( `Created "${dest}"` );

}

