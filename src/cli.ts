
// IMPORT //

import { Command } from 'commander';


import {updater} from 'specialist';
import  TemplateManager  from './command';
import {autoLoadSync} from '@tib/configload';
// CLI //

export async function CLI () {
   const program = new Command();
   
   const myJson:{name:string,version:string, description:string} = await autoLoadSync(new URL('../package.json', import.meta.url).pathname)
   updater ({ name: myJson.name , version :myJson.version});


   program
        // WIZARD //
    .action ( () => TemplateManager.wizard () )
    .name(myJson.name)
    .version(myJson.version)
    .description(myJson.description)
        // CREATE //
    program.command ( 'create').description( 'Create files from a template' )
    .argument ( '<template>', 'Template name' )
    .argument ( '[pathToOutput]', 'The Path To Output the files from the template' )
    .option ( "-m, --merge", "Merge Do Not delete files ,useful when upgrading templates")
    .option ( "-d, --dryRun", "Does a dry run  print to console output of files")
    .action ( ( template,pathToOutput, options ) => TemplateManager.create(template,pathToOutput, options))
    // LIST //
    program.command ( 'list').description( 'List installed templates' )
    .action ( () => TemplateManager.list () )
    // INSTALL //
    program.command ( 'install').description( 'Install a template from a repository' )
    .argument ( '<repository>', 'Git endpoint url, GitHub shorthand or local path' )
    .argument ( '[template]', 'Template name' )
        .action((repository, template ) =>
        {
        console.info("installing template from , %r!",repository)
            TemplateManager.install(repository, template)
        })
    // UNINSTALL //
    program.command ( 'uninstall').description( 'Uninstall one or all templates' )
    .argument ( '[template]', 'Template name' )
        .action(({repository, template }) => {
            console.info("uninstalling template from , %r!", repository)
            TemplateManager.uninstall(template)
        })
    // UPDATE //
    program.command ( 'update').description( 'Update one or all templates' )
    .argument ( '[template]', 'Template name' )
        .action((repository, template ) => {
         console.info("updating template from , %r!", repository)
            TemplateManager.update(template)
        })
    // GENERATE //
    program.command('generate').description( 'Generate files from a template')
    .alias("gen")
    .alias("scaffold")
    .argument('<template>', 'Generator or Template name')
    .argument('[pathToOutput]', 'Path to dir in which template file are generated')
    .argument('[defaults]', 'Template default values')
    .argument('[files]', ' default values')
    .action((template ,pathToOutput ) => TemplateManager.generate(template , pathToOutput))

    program.parse()

}

