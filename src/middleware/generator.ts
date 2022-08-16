import { getSchemaManager } from './schema';
import {getHookManager} from "./hooks"
//export * from "./hooks"
import prompt from "./prompt"
import { Files } from 'metalsmith';

import Metalsmith from 'metalsmith';
import  _ from 'lodash'
import Utils from '../utils';
import { metalSmithData } from './types/metalsmith';
/**
 *@internal 
 *this class is the implementation of the Metalsmith middleware
 * @param files 
 * @param ms 
 * @param next 
 */

export async function generator(files:Files ,ms:Metalsmith, next):Promise<void>{
    
    
    const schemaManager = getSchemaManager(ms.source())
    const HookManager = getHookManager(ms.source())  
    const MSData:metalSmithData = ms.metadata()

    HookManager.loadHooks().then( () =>{
    _.forOwn ( files, (file, filepath) => {

        

        if (schemaManager.isValid(filepath, file.contents)) {

            const {contents} = file;
            const fileSchema = Utils.handlebars.getSchema ( contents.toString () );
            console.log(fileSchema)

            
                if(HookManager.hasHook('BeforeParserStart'))
                {
                    HookManager.callHook.BeforeParserStart(schemaManager,filepath)
                    prompt(schemaManager.getSchema())

                    //if (files[file].draft) delete files[file]
                }
            }
            if(MSData?.options?.dryRun === true)
            {
                delete files[filepath]
            }
            
        })
        next()
        
    });
    
    
    


}
