
/* IMPORT */

import * as os from 'os';
import * as path from 'path';

/* CONFIG */
/** A constant that is used to store the configuration of the application. */
const Config = {
  autoUpdate: false,
  directory: path.join ( os.homedir (), '.template' ),
  templateConfigName: 'template',
  templateHookName: 'template.hook',//path to hook script for template loading 
  supportedConfigTypes: ["json6","json5","json","toml","yaml"]  
};

/* EXPORT */

export default Config;
