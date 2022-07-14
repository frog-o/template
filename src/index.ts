
/* IMPORT */

import ask from 'inquirer-helpers';
import {exec} from 'child_process';
import * as fs from 'fs';
import * as isUrl from 'is-url';
import * as path from 'path';
import * as pify from 'pify';
import {color} from 'specialist';
import Config from './config';
import  Utils  from './utils';
import { generator } from "./middleware"
import  { default as Metalsmith } from 'metalsmith';
//const Metalsmith  = require('metalsmith');

/* TEMPLATE */

const Template = {

  async wizard () {

    const command = await Utils.prompt.command ();

    switch ( command ) {

      case 'create': {
        const template = await Utils.prompt.template (),
              pathToOutput = await ask.input ( 'Path to template output:', false );
        return Template.create ( template, pathToOutput );
      }

      case 'list': {
        return Template.list ();
      }

      case 'install': {
        const repository = await ask.input ( 'Repository to install:' ),
              template = await ask.input ( 'Template name:', false );
        return Template.install ( repository, template );
      }

      case 'uninstall': {
        const all = await ask.noYes ( 'Do you want to uninstall all templates?' );
        if ( all ) return Template.uninstall ( false );
        const templates = Utils.templates.getNames ();
        if ( !templates.length ) return console.error ( 'No templates installed' );
        const template = await Utils.prompt.template ();
        return Template.uninstall ( template );
      }

      case 'update': {
        const all = await ask.noYes ( 'Do you want to update all templates?' );
        if ( all ) return Template.update ();
        const templates = Utils.templates.getNames ();
        if ( !templates.length ) return console.error ( 'No templates installed' );
        const template = await Utils.prompt.template ();
        return Template.update ( template );
        }
        case 'generate': {
            const template = await Utils.prompt.generate ()   
        return Template.generate ( template);
            }      

    }

    },
    async generate(template: string, pathToOutput?: string, defaults?: string, files?: string)
    {/* We have a config4 generator built-in.  The main reason generator where made is to handle the problem
    of every program wanting there version of package manager( yarn ,pnpm,npm), Until this feature was add you would keep having to put 
    "packageManager": "pnpm@7.2.1" or what ever package manager your want in package.json, delete there lockfiles and other
    annoying things over and over ,this feature attempts to solve all that by just running
    
    template gen config4 defaults
    */  
        return Template.create(template, pathToOutput, true);
        
    },

  async create ( template: string, pathToOutput?: string ,dontDelete :boolean =false) {

      pathToOutput = pathToOutput || `my-${template}`;
      
    const templatePath = Utils.template.getPath ( template, true ),
          source = templatePath && path.join ( templatePath, 'template' ),
          destination = path.join ( process.env['INIT_CWD'] as string , pathToOutput );
      
    if ( !source ) return console.error ( `"${template}" is not a valid template` );

    if ( fs.existsSync ( destination ) && dontDelete === false) {

      const okay = await ask.noYes ( `There's already a file or folder named "${pathToOutput}", do you want to overwrite it?` );

      if ( !okay ) return;
                
            await Utils.delete ( destination );  

    }

    if ( Config.autoUpdate ) await Template.update ( template );

    const ms = Metalsmith ( __dirname );
    ms.use(generator)
    
    Utils.handlebars.useHelpers();
    //Utils.metalsmith.useMiddlewares ( ms );

    ms.clean ( !dontDelete )
      .frontmatter ( false )
      .source ( source )
      .destination ( destination )
      .build ( err => {
        if ( err ) throw err;
      });

    console.log ( `Created "${destination}"` );

  },

  async list () {

    const names = await Utils.templates.getNames ();

    if ( !names.length ) {

      console.log ( 'No templates installed' );

    } else {

      names.forEach ( name => console.log ( name ) );

    }

  },

  async install ( repository: string, template?: string ) {

    const endpoint = Utils.repository.getEndpoint ( repository );

    if ( endpoint ) {

      template = template || Utils.template.guessName ( endpoint );

      if ( !template ) return console.error ( 'You must provide a template name' );

      const destination = Utils.template.getPath ( template );

      if ( fs.existsSync ( destination ) ) {

        const okay = await ask.noYes ( `There's already a templated named "${template}", do you want to overwrite it?` );

        if ( !okay ) return;

        await Utils.delete ( destination );

      }

      try {

        if ( isUrl ( endpoint ) ) {

          await pify ( exec )( `git clone ${endpoint} ${destination}` );

        } else { // Local directory

          await pify ( exec )( `rsync -av --exclude=*/.git ${endpoint}/ ${destination}` );

        }

        console.log ( `Template "${repository}" installed as "${template}"` );
        console.log ( `Run "template create ${template} ${color.blue ( '<pathToOutput>' )}" to get started` );

      } catch ( e ) {

        console.error ( `Failed to install template "${template}"` );
        console.error ( e.message );

      }

    } else {

      console.log ( `"${repository}" is not a repository` );

    }

  },

  async uninstall ( template?: string | boolean ) {

    if ( !template ) { // All

      if ( template !== false ) {

        const okay = await ask.noYes ( 'Are you sure you want to uninstall all templates?' );

        if ( !okay ) return;

      }

      const names = await Utils.templates.getNames ();

      if ( !names.length ) return console.error ( 'No templates installed' );

      names.forEach ( name => Template.uninstall ( name ) );

    } else { // Single

      const folderPath = Utils.template.getPath ( template, true );

      if ( !folderPath ) return console.error ( `"${template}" is not installed` );

      await Utils.delete ( folderPath );

      console.log ( `"${template}" deleted` );

    }

  },

  async update ( template?: string ) {

    if ( !template ) { // All

      const names = await Utils.templates.getNames ();

      if ( !names.length ) return console.error ( 'No templates installed' );

      names.forEach ( name => Template.update ( name ) );

    } else { // Single

      const folderPath = Utils.template.getPath ( template, true );

      if ( !folderPath ) return console.error ( `"${template}" is not installed` );

      try {

        const isRepository = Utils.exists ( path.join ( folderPath, '.git' ) );

        if ( isRepository ) {

          const result = await pify ( exec )( 'git pull', { cwd: folderPath } );

          if ( result.match ( /already up-to-date/i ) ) {

            console.log ( `No updates available for "${template}"` );

          } else {

            console.log ( `"${template}" has been updated` );

          }

        } else {

          console.error ( `"${template}" is not a repository, it can't be updated` );

        }

      } catch ( e ) {

        console.error ( `Failed to update template "${template}"` );
        console.error ( e.message );

      }

    }

  }

};

/* EXPORT */

export default Template;
