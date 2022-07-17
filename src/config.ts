
/* IMPORT */

import * as os from 'os';
import * as path from 'path';

/* CONFIG */

const Config = {
  autoUpdate: false,
  directory: path.join ( os.homedir (), '.template' ),
  templateConfigName: 'template',
  //path to hook script for template loading 
  templateHookName: 'template.hook',
  
};

/* EXPORT */

export default Config;
