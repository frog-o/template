
/* EXPORT */

//import { default as prompt } from './prompt';
//import { default as render } from './render';
import { schemaManager  as schemaManager } from './schema';
import {getHookManager} from "./hooks"
export * from "./hooks"
import { Files } from 'metalsmith';
import path from 'path';
import Metalsmith from 'metalsmith';
import  _ from 'lodash'

export default async function generator(files:Files ,ms:Metalsmith, next):Promise<void>{
    
    const msPaths={
    source : ms.source(),
    template :path.dirname ( ms.source())
   }
    //template = path.basename(schema);
    //const metadata= metalsmith.metadata () as JSON
    const schema = schemaManager.get(msPaths.template)
    const HookManager = getHookManager(msPaths.template)  

    HookManager.loadHooks().then( () =>{
    _.forOwn ( files, (file, filepath) => {

        

        if (schema.isFileValid(filepath, file.contents)) {

            //metadata.schema = schema.getSchema(filepath, file.contents);
            

            
                if(HookManager.hasHook('BeforeParserStart'))
                {
                    HookManager.call('BeforeParserStart',file.filepath,schema)
                }
            }

        })

        next()
    });
    
    
    


}

