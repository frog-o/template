
/* With the addition of the sdk in template 1.1.6 thing in the middleware are now
drastically different.  It was a complete rewrite while trying to keep backwards compatibility  
While doing the rewrite we add esm support and  a lot of thing had to change notably 
import package.json (which is experimental as when this commit was written and there 
are other ways to do it). The changes made to template 1.1.6 allow us to do that
as a bonus it should allow us to support other package format as well tom,json5 etc. in the config. 
*/ 
 
import fs from 'fs';
import isBinary from 'isbinaryfile';
//import { autoLoadSync } from '@tib/configload';
import {parse, load} from 'left-phalange-api'

import _ from 'lodash';
import path from 'path';
import Config from '../config';
import Utils from '../utils';

import {filterData, schemaDate} from './types/schema';
import { variableManager } from './variable';
import { isArray} from '@i-doit/enten-types';


export class SchemaData {

  
  private _filterData:filterData
  private _Variables 
  private _loadedJSON:schemaDate

  private parseData(loadedJSON)
  {
    this._loadedJSON = loadedJSON
    if (isArray(loadedJSON.filter))
    {
      this._filterData.noParse=loadedJSON.filter 
    }
   
    
    this._Variables= new variableManager(this._loadedJSON?.variables,loadedJSON?.variablesOrder??[])
    
    
  }
/**
 * The SchemaData Class is a class that represent the data from one of the supported types
 * 
 * @param  path2ConfigOrString - This is the path to the configuration file or the
 * String that need to be parse.
 * @param  [subConf] - string - The name of the sub-configuration to load.
 */
  constructor(path2ConfigOrString: string, subConf?: string) {
    
    const fullPath = Utils.addExtensionType(path2ConfigOrString,Config.supportedConfigTypes)
    //if find path Load it 
    if (fullPath !=="None"){
    path2ConfigOrString = fullPath
    this.loadConf(path2ConfigOrString, subConf).then((loadedJSON:schemaDate)=>{this.parseData(loadedJSON)})
    }
    //if it not path assume that it a string that need prase 
    else {
      parse(path2ConfigOrString)
    }
    
  }
  getVariables():string[]
  {
  return this._Variables.getVariables();
  }
  getFilter():string[]
  {
  if(this._filterData.noParse !== undefined)  
  {return this._filterData.noParse}
  else
  return []
  }

  
  /**
   * It loads a Config file and stores it as an schemaDate object
   * @param {string} path2conf - the path to the configuration file
   * @param {string} [subConf] - This is the name of the sub-configuration you want to load. If you
   * don't need a sub-configuration, then you can leave this parameter blank.
   */
  
  
  async loadConf(path2conf: string, subConf?: string):Promise<schemaDate> {

    if(!fs.existsSync(path2conf) || path2conf ==="None"){return {} }
    
    let configData:schemaDate = await load(path2conf)
      
    if (subConf === undefined){return configData}
    
    if (subConf in configData) {
      configData = configData[subConf]
    }
    return configData    
    

}
}


/* TEMPLATE SCHEMA */
/* FILES SCHEMA */
/* COMPUTER SCHEMA */


export function getSchemaManager(path2template): schemaManager {
  return new schemaManager(path2template)
}

export class schemaManager  {
  

  _schema = new Map<string, SchemaData>()


    

  constructor(path2template: string) {
    

    const sPath =
    {
      "computer": path.join(Config.directory, Config.templateConfigName),
      "template": path.join(path2template, Config.templateConfigName)
    }
    
    this._schema["computer"]= new SchemaData (sPath.computer,path.basename(path2template))
    this._schema["template"]= new SchemaData (sPath.template)
    this._schema["global"] = _.merge(this._schema["global"], this._schema["template"], this._schema["computer"])
    
  }
  getFilter(type="global")
  {
  if (this._schema.has(type))
  {
  return this._schema[type]._filter
  }
  return undefined
  }

  isValid(filepath, contents) {
   //check global filter first 
    if (Utils.template.isFileSkipped(filepath, this.getSchema()._filter)) return false
    //check file filter second
    if (Utils.template.isFileSkipped(filepath, this.getSchema(filepath)._filter)) return false
    if (isBinary.sync(contents, contents.length)) return false;
    return true
  }

  getSchema(filepath="global") {

    
    
    return this._schema[filepath]
  }

}
export default schemaManager