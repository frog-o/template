import ask from 'inquirer-helpers';

import  Utils  from '../utils';



export async function wizard () {
    
    const command = await Utils.prompt.command ();

    switch ( command ) {

      case 'create': {
        const template = await Utils.prompt.template (),
              pathToOutput = await ask.input ( 'Path to template output:', false );
        return command.create ( template, pathToOutput );
      }

      case 'list': {
        return this.list ();
      }

      case 'install': {
        const repository = await ask.input ( 'Repository to install:' ),
              template = await ask.input ( 'Template name:', false );
        return this.install ( repository, template );
      }

      case 'uninstall': {
        const all = await ask.noYes ( 'Do you want to uninstall all templates?' );
        if ( all ) return this.uninstall ( false );
        const templates = Utils.templates.getNames ();
        if ( !templates.length ) return console.error ( 'No templates installed' );
        const template = await Utils.prompt.template ();
        return this.uninstall ( template );
      }

      case 'update': {
        const all = await ask.noYes ( 'Do you want to update all templates?' );
        if ( all ) return this.update ();
        const templates = Utils.templates.getNames ();
        if ( !templates.length ) return console.error ( 'No templates installed' );
        const template = await Utils.prompt.template ();
        return this.update ( template );
        }
        case 'generate': {
            const template = await Utils.prompt.generate ()   
        return this.generate ( template);
            }      

    }
  }
  