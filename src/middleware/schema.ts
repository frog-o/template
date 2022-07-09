
/* IMPORT */

import * as _ from 'lodash';
import * as isBinary from 'isbinaryfile';
import * as path from 'path';
import Config from '../config';
import Utils from '../utils';

/* SCHEMA */
export function loadSchema(templatePath: string)
{
return  new schema(templatePath)   
}
interface varValues{}
 export class schema {
     templateSchema: any;
     computerSchema: any;
     projectSchema: any;

     fileSchema :any;
     filter: any
     Variables = new Map<string,varValues>()
     templateName: string;
    
  /* VARIABLES */

  
    constructor(templatePath: string) {
        
        const computerConfig = Utils.loadJSON(path.join(Config.directory, Config.templateConfigName))

        this.templateSchema = Utils.loadJSON(path.join(templatePath, Config.templateConfigName))
        this.computerSchema = _.get(computerConfig, `templates.${this.templateName}`);
        this.projectSchema = Utils.loadJSON('./.templates/templates.json')
        this.templateName = path.basename(templatePath);
    }

        
     isFileVailid(filepath,contents) {
         
         if (Utils.template.isFileSkipped(filepath, this.filter)) return false
         if (isBinary.sync(contents, contents.length)) return false;
         return true
     }

    getSchema(filepath,contents)
     {            _.extend(this.Variables[filepath], this.fileSchema);
        
         const fileSchema = Utils.handlebars.getSchema(contents.toString());
        

        
        
            const schemaData = _.merge(fileSchema, this.templateSchema, this.computerSchema, this.projectSchema);

        return schemaData;

    }

}
