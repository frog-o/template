
/* EXPORT */

//import { default as prompt } from './prompt';
//import { default as render } from './render';
import { schemaManager  as schemaManager } from './schema';
import { hookManager ,hooks} from"./hooks"
import { Files ,} from 'metalsmith';
import * as path from 'path';
import * as Metalsmith from 'metalsmith';
import * as _ from 'lodash'

export async function generator(files:Files ,ms:Metalsmith, next):Promise<void>{
    
    const msPaths={
    source : ms.source(),
    template :path.dirname ( ms.source())
   }
    //template = path.basename(schema);
    //const metadata= metalsmith.metadata () as JSON
    const schema = schemaManager.get(msPaths.template)
    
    _.forOwn ( files, (file, filepath) => {

        if (schema.isFileVailid(filepath, file.contents)) {

            //metadata.schema = schema.getSchema(filepath, file.contents);
            const hook = new hookManager(msPaths.template)

            hook.loadHooks().then( (hook:hooks) =>{
                hook.StartPraser(file.filepath,schema)
            })

        }


    });
    //forEach(files => {
    //    schema.load(templatePath,file.filepath)
        
   // });

    


};

