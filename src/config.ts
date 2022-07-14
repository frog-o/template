
/* IMPORT */

import * as os from 'os';
import * as path from 'path';

/* CONFIG */

const Config = {
  autoUpdate: false,
  directory: path.join ( os.homedir (), '.template' ),
    templateConfigName: 'template.json',
  //path to hook script for template loading 
  hooksName:'hook'
};

/* EXPORT */

export default Config;
