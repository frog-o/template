import Utils from "../utils";
import path from 'path';
import pify from 'pify';
import {exec} from 'child_process';

export class templateUpdate{
async Update ( template?: string ) {

    if ( !template ) { // All

      const names = await Utils.templates.getNames ();

      if ( !names.length ) return console.error ( 'No templates installed' );

      names.forEach ( name => this.Update( name ) );

    } else { // Single

      const folderPath = Utils.template.getPath ( template);

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
}