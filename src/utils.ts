/* eslint-disable no-useless-escape */


/* IMPORT */

import _ from 'lodash';
import absolute from 'absolute';
import ask from 'inquirer-helpers';
import del from 'del';
import handlebars from 'handlebars'
import finder from 'fs-finder';
import fs from 'fs';
import isUrl from 'is-url';

import multimatch from 'multimatch';
import path from 'path';
import Config from './config';
import * as Helpers from './helpers';
import Middleware from './middleware'

/* UTILS */
function isDirectory(directory):boolean
{
  if (!fs.existsSync(directory)){return false}
  return fs.statSync(directory).isDirectory()
}
const Utils = {


  delete ( path ) {

    return del ( path, { force: true } );

  },

  exists ( path ) {

    try {
      fs.accessSync ( path );
      return true;
    } catch ( e ) {
      return false;
    }

  },

  repository: {

    getEndpoint ( repository: string ) {

      if ( isUrl ( repository ) ) {

        /* GIT ENDPOINT */

        if ( repository.match ( /\.git$/ ) ) return repository;

        /* GITHUB REPOSITORY */

        // eslint-disable-next-line no-useless-escape
        const repo = repository.match ( /.+github\.com\/([^\s\/.]+)\/([^\s\/#]+)(?:$|\/|#)/ );

        if ( repo ) return `https://github.com/${repo[1]}/${repo[2]}.git`;

      } else {

        /* GITHUB SHORTHAND */

        const shorthand = repository.match ( /^([^\s\/.]+)\/([^\s\/]+)$/ );

        if ( shorthand ) return `https://github.com/${shorthand[1]}/${shorthand[2]}.git`;

        /* PATH */

        if ( absolute ( repository ) ) {

          if ( isDirectory ( repository ) ) return repository;

        } else {

          const fullPath = path.join ( process.cwd (), repository );

          if ( isDirectory ( fullPath ) ) return fullPath;

        }

      }

      return;

    }

  },

  templates: {

    getPaths () {

      return _.sortBy ( finder.in ( Config.directory ).findDirectories (), [p => p.toLowerCase ()] ) as string[];

    },

    getNames () {

      const paths = Utils.templates.getPaths ();

      return paths.map ( p => path.basename ( p ) );

    }

  },

  template: {
    /*The old version of template < 1.1.5 had a template dir which make templates of everything in that dir
    in version of template >1.15 template has been renamed to TNTConf.d and everything is ignore in it.
    This allow you to put you template with your project and setup per file config.
    */ 
    hasTNTConfDir(templatePath:string):boolean{ 
    
      return isDirectory(path.join(templatePath,"TNTConf.d"))
  
      },
    hasTemplateDir(templatePath:string):boolean{ 
    
    return isDirectory(path.join(templatePath,"template"))

    },

    getPath ( name) {

          const templatePath = path.join(Config.directory, name);
          if (name == "files4")
          {
              if (!isDirectory(templatePath))
              {
                  const templatePath = path.join('builtin', name);
                  return templatePath;
              }
          }

      return templatePath;

    },

    guessName ( endpoint: string ) {

      const lastPart = _.last ( endpoint.split ( '/' ) );

      if ( !lastPart ) return;

      return lastPart.trim ()
                     .replace ( /^template-/, '' )
                     .replace ( /\.git$/, '' );

    },

    isFileSkipped ( filepath, globs ) {

      return globs && !multimatch ( filepath, globs, { dot: true } ).length;

    }

  },

  prompt: {

    command () {

      const commands = ['create', 'list', 'install', 'uninstall', 'update','generate'];

      return ask.list ( 'What command to you want to execute?', commands );

    },

    template () {

      const templates = Utils.templates.getNames ();

      return ask.list ( 'What template do you want to use?', templates );

    },
    generate()
    {   //loads all template and generators
        const generators = Utils.templates.getNames();
        //add builtin generator
        generators.push ("files4")
        return ask.list ( 'What generator or template do you want to use?', generators );
    }

  },

  handlebars: {

    useHelpers () {

      handlebars.registerHelper ({
        eval: Helpers.eval,
        _: Helpers.lodash
      });

    },

    getSchema ( template ) {

      const body = _.isString ( template ) ? handlebars.parse ( template ).body : template,
            schema = {},
            schemaTypes = {
              BlockStatement: 'confirm',
              MustacheStatement: 'input'
            };

      body.forEach ( obj => {

        const {type, params, path, program} = obj,
              schemaType = schemaTypes[type],
              objSchema = { type: schemaType };

        if ( !schemaType ) return;

        if ( params.length ) {

          params.forEach ( param => {

            const {type, parts} = param;

            if ( type !== 'PathExpression' ) return;

            schema[parts.join ( '.' )] = objSchema;

          });

        } else if ( path ) {

          schema[path.parts.join ( '.' )] = objSchema;

        }

        if ( obj.hash ) {

          obj.hash.pairs.forEach ( pair => {

            const {original} = pair.value;

            if ( !_.isString ( original ) || !original.match ( /[^\s;.]+/) ) return;

            schema[original] = objSchema;

          });

        }

        if ( program ) {

          _.extend ( schema, Utils.handlebars.getSchema ( program.body ) );

        }

      });

      return schema;

    }

  },

  metalsmith: {

    useMiddlewares ( metalsmith ) {

      metalsmith.use ( Middleware )
     //           .use ( Middlewares.prompt )
     //           .use ( Middlewares.render );

    }

  }

};

/* EXPORT */

export default Utils;
