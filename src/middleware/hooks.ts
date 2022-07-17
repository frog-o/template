import * as path from 'path';
import Config from '../config';
import * as fs from 'fs'
import { schemaManager} from './schema';


export interface hooks{
    BeforeParserStart(schema :schemaManager,filepath:fs.PathLike):void

}
export function getHookManager(path)
    {
     return new hookManager(path)   
    }
export class hookManager 
{
    hasHook(property: string) {
        return (typeof(this._hooks[property]==='function'))
        
    }
    call(property: string, ...args) {
        if (this.hasHook(property))
        {
         const myFun = this._hooks[property]   
         if(myFun.length === args.length)
           {
            myFun(args)
           }
        }
        
    }
    
    _templatePath;
    _templateHasHook = false;
    _hooks:hooks;
    constructor(templatePath:string) {

        this._templatePath = templatePath 
        this._templateHasHook = this.templateHasHook()
        if (this._templateHasHook) {
            this.loadHooks()
            
        }
    
    }
    
    async loadHooks()
    {
        this._hooks = await import(path.join(this._templatePath, Config.templateHookName)) 
        return this._hooks
    }

    templateHasHook():boolean
    {
        
        const check4js = path.join(this._templatePath,"TNTConf.d" ,Config.templateHookName + ".js")
        const check4ts = path.join(this._templatePath,"TNTConf.d", Config.templateHookName + ".ts")
        
        if (fs.existsSync(check4js)||fs.existsSync(check4ts)) return true
        return false
    }
    /*
    async StartParser(schema :schemaManager,filepath)
    {
        if (this._hasHook == false) return false

        if (this._hooks.hasOwnProperty("StartParse")) {
            this._hooks.StartParse(schema,filepath)
            return true;
        }
        return false;

    }
*/    
}