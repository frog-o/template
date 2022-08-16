import ask from 'inquirer-helpers';
import {exec} from 'child_process';
import fs from 'fs';
import isUrl from 'is-url';

import pify from 'pify';
import {color} from 'specialist';

import  Utils  from '../utils';

export async function install ( repository: string, template?: string ) {

    const endpoint = Utils.repository.getEndpoint ( repository );

    if ( endpoint ) {

      template = template || Utils.template.guessName ( endpoint );

      if ( !template ) return console.error ( 'You must provide a template name' );

      const destination = Utils.template.getPath ( template );

      if ( fs.existsSync ( destination ) ) {

        const okay = await ask.noYes ( `There's already a templated named "${template}", do you want to overwrite it?` );

        if ( !okay ) return;

        await Utils.deleteDir ( destination );

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

  }
