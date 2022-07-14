import * as path from 'path';
import Config from '../config';
import * as fs from 'fs'
import { schemaManager} from './schema';

export class hooks{
    async StartPraser(schema :schemaManager,filepath)
    {}
}

export class hookManager extends hooks
{
    _templatePath;
    _hasHook = false;
    _hooks:hooks;
    constructor(templatePath:string) {
        super()
        this._templatePath = templatePath 
        this._hasHook = this.hasHook()
        if (this._hasHook) {
            this.loadHooks()
            
        }
    
    }
    async loadHooks()
    {
        this._hooks = await import(path.join(this._templatePath, Config.hooksName)) 
        return this._hooks
    }
    hasHook():boolean
    {
        const check4js = path.join(this._templatePath, Config.hooksName + ".js")
        const check4ts = path.join(this._templatePath, Config.hooksName+".ts")
        if (fs.existsSync(check4js)||fs.existsSync(check4ts)) return true
        return false
    }
    /*
    async StartPraser(schema :schemaManager,filepath)
    {
        if (this._hasHook == false) return false

        if (this._hooks.hasOwnProperty("StartPraser")) {
            this._hooks.StartPraser(schema,filepath)
            return true;
        }
        return false;

    }
*/    
}