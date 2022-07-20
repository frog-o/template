
/* IMPORT */


import _ from 'lodash';
import isBinary from 'isbinaryfile';
import path from 'path';
import Config from '../config';
import { autoLoadSync } from '@tib/configload';
import * as JSOXpackage from 'jsox'
const { JSOX } = JSOXpackage
import Utils from '../utils';
import fs from 'fs';


//import * as json5 from "json5"

export class basicFilter {

}
/* BASIC SCHEMA */
export class Schema {


  filter: basicFilter
  Variables = new Map<string, basicVariable>()
  json: JSON;


  static load(path: string, subJSON?: string) {

    if (subJSON !== undefined) { return new Schema(path, subJSON) }
    return new Schema(path)
  }


  constructor(path2conf: string, subConf?: string) {
    path2conf = path.join(path2conf,Config.templateConfigName)
    path2conf = path.join(this.FindExtension(path2conf))
    if(fs.existsSync(path2conf)){
    if (subConf === undefined) {
      
      autoLoadSync(path2conf).then((loadedJSON) => { this.json = loadedJSON })
    }
    else {
      autoLoadSync(path2conf).then((loadedJSON) => {
        let text = "{}"
        if (loadedJSON.hasOwnProperty.call(subConf)) {
          text = loadedJSON[subConf].stringify
        }

        this.json = JSOX.parse(text)
      })
    }
  }
  }
  FindExtension(file:string):string
  {
  if (fs.existsSync(file+".json6")){return "json6"}
  if (fs.existsSync(file+".json5")){return "json5"}
  if (fs.existsSync(file+".yaml")){return "yaml"}
  if (fs.existsSync(file+".toml")){return "toml"}
  return "None"
  }

}

export class basicVariable { }


export class schemaManager extends Schema {

  _schema = new Map<string, Schema>()

  /* VARIABLES */
  static get(path2template): schemaManager {
    return new schemaManager(path2template)
  }

  constructor(path2template: string) {
    super(path2template)

    const sPath =
    {
      "computer": path.join(Config.directory, Config.templateConfigName),
      "template": path.join(path2template, Config.templateConfigName)
    }


    this._schema["computer"] = schemaManager.load(sPath.computer, "templates." + path.basename(path2template))
    this._schema["template"] = schemaManager.load(sPath.template)
    this._schema["merged"] = _.merge(this._schema["merged"], this._schema["template"], this._schema["computer"])
    //this._schema["file"] = json5.parse()
  }


  isFileValid(filepath, contents) {

    if (Utils.template.isFileSkipped(filepath, this.filter)) return false
    if (isBinary.sync(contents, contents.length)) return false;
    return true
  }

  getSchema(filepath, contents) {

    this._schema["file"] = Utils.handlebars.getSchema(contents.toString());
    _.extend(this.Variables[filepath], this._schema["file"]);
    return this._schema["file"]
  }

}
