
/* EXPORT */

//import { default as prompt } from './prompt';
//import { default as render } from './render';
import { loadSchema } from './schema';
import {templateLoader} from"./template"
import * as path from 'path';
import { Files ,File } from 'metalsmith';
import Metalsmith = require('metalsmith');


export function generator(files:Files ,metalsmith:Metalsmith, next):void{
    
    const source = metalsmith.source(),
    templatePath = path.dirname ( source )
    //template = path.basename(schema);
    const metadata= metalsmith.metadata () as any
    const schema = loadSchema(templatePath)
    
   
    files.file.forEach((file: File) => {
    schema.isFileVailid(file.filepath,file.contents)
        metadata.schema = schema.getSchema(file.filepath, file.contents);
        const template = new templateLoader(templatePath)
        if (template.hasHook()) { 
            
        }
        
    
    })
    //forEach(files => {
    //    schema.load(templatePath,file.filepath)
        
   // });

    


};

