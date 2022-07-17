import Config from '../config';
import  Utils  from '../utils';
import  generator  from "../middleware"
import * as path from 'path';
import  { default as Metalsmith } from 'metalsmith';
import * as fs from 'fs';
import ask from 'inquirer-helpers';
import { TemplateManager as Template } from '..';



export class  templateCreate {
async create ( templateName: string, pathToOutput?: string ,dontDelete  =false) {

    pathToOutput = pathToOutput || `my-${templateName}`;
    
  let source = Utils.template.getPath (templateName)
  const destin = path.join ( process.env['INIT_CWD'] as string , pathToOutput );
    
  if ( !source ) {return console.error ( `"${templateName}" is not a valid template` );}
   
  if (Utils.template.hasTemplateDir(source)){source = path.join(source,'template')}

  if ( fs.existsSync ( destin ) && dontDelete === false) {

    const okay = await ask.noYes ( `There's already a file or folder named "${pathToOutput}", do you want to overwrite it?` );

    if ( !okay ) return;
              
          await Utils.delete ( destin );  

  }

  if ( Config.autoUpdate ) await Template.update ( templateName );

  const ms = Metalsmith (new URL('.', import.meta.url).pathname );
  ms.use(generator)
  
  Utils.handlebars.useHelpers();


  ms.clean ( !dontDelete )
    .frontmatter ( false )
    .source ( source )
    .destination ( destin )
    .build ( err => {
      if ( err ) throw err;
    });

  console.log ( `Created "${destin}"` );

}
}
