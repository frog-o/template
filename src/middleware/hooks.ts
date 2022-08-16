import * as path from 'path';
import Config from '../config';
import * as fs from 'fs'
import { schemaManager} from './schema';
import Utils  from '../utils';

/* Creating a hookManager class and exporting it. */
export interface IHookCallbacks{
    BeforeParserStart(schema :schemaManager,filepath:fs.PathLike):void

}
/**
 * The getHookManager function returns a new hookManager object.
 * @param path - The path to the directory where the hooks are stored.
 * @returns A new instance of the hookManager class.
 */
export function getHookManager(path)
    {
     return new hookManager(path)   
    }
export class hookManager 
{
    callHook:IHookCallbacks 

    hasHook(property: string) {
        if(this.callHook !== undefined)
        
        if (this.callHook[property]!== undefined)
           {return true}
        return false
        
    }
    call(property: string, ...args) {
        if (this.callHook !== undefined)
        {
        if (typeof(this.callHook[property])==="function")
        {
         const myFun = this.callHook[property] 
             
         
         if(myFun.length === args.length)
           {
            myFun(args)
           }
        }
    }
        
    }
    
    _templatePath;
    _templateHasHook = false;
    _hooks:IHookCallbacks;
    _hookFullPath:string;
    constructor(templatePath:string) {

        this._templatePath = templatePath 
        this._templateHasHook = this.templateHasHook()
        if (this._templateHasHook) {
            this.loadHooks()
            
        }
    
    }
    
    async loadHooks()
    {   if(this._hookFullPath !=="None")
        {
        if (this._hooks === undefined)
        {
        this._hooks = await import(this._hookFullPath) 
        if (this._hooks["myHook"]!== undefined)
        {
        this.callHook = new this._hooks["myHook"]()
        }
        }
    }
        return this._hooks
    }

    templateHasHook():boolean
    {
        
        let check4hook = path.join(this._templatePath,"template",Config.templateHookName)
        check4hook= Utils.addExtensionType(check4hook,["ts","tsc","tsm","js","jsc","jsm"])
        this._hookFullPath =check4hook
        if (check4hook !== "none") {return true }
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