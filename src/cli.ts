
/* IMPORT */

const caporal = require("@caporal/core").default
import {updater} from 'specialist';
import {name, version} from '../package.json';
import Template from '.';

/* CLI */

async function CLI () {
  
  updater ({ name, version });

    caporal
        /* WIZARD */
    .action ( () => Template.wizard () )
        /* CREATE */
    .command ( 'create', 'Create files from a template' )
    .argument ( '<template>', 'Template name' )
    .argument ( '[path2TempDir]', 'Path To Template Dir' )
    .option ( "-dd, --dontDelete", "Do Not delete files ,useful when upgrading templates")
    .action ( ({ args, options }) => Template.create(args.template, args.path2TempDir, options.dontDelete))
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
            Template.install(args.repository, args.template)
        })
    /* UNINSTALL */
    .command ( 'uninstall', 'Uninstall one or all templates' )
    .argument ( '[template]', 'Template name' )
        .action(({ logger, args }) => {
            logger.info("unintalling template from , %r!", args.repository)
            Template.uninstall(args.template)
        })
    /* UPDATE */
    .command ( 'update', 'Update one or all templates' )
    .argument ( '[template]', 'Template name' )
        .action(({ logger, args }) => {
            logger.info("updateing template from , %r!", args.repository)
            Template.update(args.template)
        })
    /* GENERATE */
    .command('generate', 'Generate files from a template')
    .alias("gen", "scaffold")
    .argument('<template>', 'Generator or Template name')
    .argument('[path2TempDir]', 'Path to dir in wich template file are generated')
    .argument('[defaults]', 'Template default values')
    .argument('[files]', ' default values')
    .action(({ args }) => Template.generate(args.template, args.path2TempDir, args.defaults, args.files))
    
  caporal.run(process.argv.slice(2))

}

/* EXPORT */

export default CLI;
