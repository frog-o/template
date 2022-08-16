import ask from 'inquirer-helpers';

import  Utils  from '../utils';

export async function uninstall ( template?: string | boolean ) {

    if ( !template ) { // All

      if ( template !== false ) {

        const okay = await ask.noYes ( 'Are you sure you want to uninstall all templates?' );

        if ( !okay ) return;

      }

      const names = await Utils.templates.getNames ();

      if ( !names.length ) return console.error ( 'No templates installed' );

      names.forEach ( name => this.uninstall ( name ) );

    } else { // Single

      const folderPath = Utils.template.getPath ( template);

      if ( !folderPath ) return console.error ( `"${template}" is not installed` );

      await Utils.deleteDir ( folderPath );

      console.log ( `"${template}" deleted` );

    }

  }

