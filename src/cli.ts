
/* IMPORT */


import pkg from '@caporal/core';
const { program } = pkg;

import {updater} from 'specialist';
import Template from '.';
import {autoLoadSync} from '@tib/configload';

/* CLI */

export async function CLI () {

//   const myjson = await import('../package.json', {
//    assert: { type: 'json' }
//  });
   const myjson = await autoLoadSync('package.json') as any
   const name = myjson.name;
   const version = myjson.version;
   updater ({ name , version });


   program
        /* WIZARD */
    .action ( () => Template.wizard () )
        /* CREATE */
    .command ( 'create', 'Create files from a template' )
    .argument ( '<template>', 'Template name' )
    .argument ( '[path2TempDir]', 'Path To Template Dir' )
    .option ( "-dd, --dontDelete", "Do Not delete files ,useful when upgrading templates")
    .action ( ({ args, options }) => Template.create(args.template as string, args.path2TempDir as string, options.dontDelete as boolean))
    /* LIST */
    .command ( 'list', 'List installed templates' )
    .action ( () => Template.list () )
    /* INSTALL */
    .command ( 'install', 'Install a template from a repository' )
    .argument ( '<repository>', 'Git endpoint url, GitHub shorthand or local path' )
    .argument ( '[template]', 'Template name' )
        .action(({logger, args }) =>
        {
            logger.info("intalling template from , %r!", args.repository)
            Template.install(args.repository as string, args.template as string)
        })
    /* UNINSTALL */
    .command ( 'uninstall', 'Uninstall one or all templates' )
    .argument ( '[template]', 'Template name' )
        .action(({ logger, args }) => {
            logger.info("unintalling template from , %r!", args.repository)
            Template.uninstall(args.template as string)
        })
    /* UPDATE */
    .command ( 'update', 'Update one or all templates' )
    .argument ( '[template]', 'Template name' )
        .action(({ logger, args }) => {
            logger.info("updateing template from , %r!", args.repository)
            Template.update(args.template as string)
        })
    /* GENERATE */
    .command('generate', 'Generate files from a template')
    .alias("gen", "scaffold")
    .argument('<template>', 'Generator or Template name')
    .argument('[path2TempDir]', 'Path to dir in wich template file are generated')
    .argument('[defaults]', 'Template default values')
    .argument('[files]', ' default values')
    .action(({ args }) => Template.generate(args.template as string, args.path2TempDir as string, args.defaults as string, args.files as string))

    program.run(process.argv.slice(2))

}

