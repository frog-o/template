import * as path from 'path';
import Config from '../config';
import * as fs from 'fs'
import { schemaManager} from './schema';
export interface hookCallbacks{
    BeforeParserStart(schema :schemaManager,filepath:fs.PathLike):void

}
export function getHookManager(path)
    {
     return new hookManager(path)   
    }
export class hookManager 
{
    _hookCallbackClass:hookCallbacks 

    hasHook(property: string) {
        if(this._hookCallbackClass !== undefined)
        
        if (this._hookCallbackClass[property]!== undefined)
           {return true}
        return false
        
    }
    call(property: string, ...args) {
        if (this._hookCallbackClass !== undefined)
        {
        if (typeof(this._hookCallbackClass[property])==="function")
        {
         const myFun = this._hookCallbackClass[property] 
             
         
         if(myFun.length === args.length)
           {
            myFun(args)
           }
        }
    }
        
    }
    
    _templatePath;
    _templateHasHook = false;
    _hooks:hookCallbacks;
    _hookFullPath:string;
    constructor(templatePath:string) {

        this._templatePath = templatePath 
        this._templateHasHook = this.templateHasHook()
        if (this._templateHasHook) {
            this.loadHooks()
            
        }
    
    }
    getHookType(filepath)
    {
        if (fs.existsSync(filepath+".ts")){return  ".ts"}
        if (fs.existsSync(filepath+".mts")){return ".mts"}
        if (fs.existsSync(filepath+".cts")){return ".cts"}
        if (fs.existsSync(filepath+".js")){return  ".js"}
        if (fs.existsSync(filepath+".cjs")){return ".cjs"}
        if (fs.existsSync(filepath+".mjs")){return ".mjs"}
        return "None"
           
    }

    async loadHooks()
    {   if(this._hookFullPath !=="None")
        {
        if (this._hooks === undefined)
        {
        this._hooks = await import(this._hookFullPath) 
        if (this._hooks["myHook"]!== undefined)
        {
        this._hookCallbackClass = new this._hooks["myHook"]()
        }
        }
    }
        return this._hooks
    }

    templateHasHook():boolean
    {
        
        let check4hook = path.join(this._templatePath,"template",Config.templateHookName)
        check4hook= path.join(check4hook+this.getHookType(check4hook))
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