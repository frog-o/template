
import { URL ,fileURLToPath } from "url"
import Config from "../../src/config"
import Utils from "../../src/utils"

test(" function addExtensionType",()=>
{
    for (const types of Config.supportedConfigTypes)

    {
    // test absolute url        
        let url = new URL("../config/TEST"+types,import.meta.url)
        let  value= Utils.addExtensionType(url,Config.supportedConfigTypes)
        expect(value).not.toBe("None")
    //test absolute string
        expect(Utils.addExtensionType(fileURLToPath(url),Config.supportedConfigTypes)  ).not.toBe("None")

    // test relative 
    value= Utils.addExtensionType("../config/TEST"+types,Config.supportedConfigTypes)
    expect(value).not.toBe("None")
    }
    })
    test(" function getSWD",()=>
    {  
     const dir = new URL(".",import.meta.url).pathname
        expect(Utils.getSWD()).toBe(dir)
    })

test("function isDirectory",()=>
{
    const thisDir= Utils.getSWD()
    const dir = new URL(import.meta.url).pathname
    expect(Utils.isDirectory(thisDir)).toBe(true)
    expect(Utils.isDirectory(dir)).toBe(false)
})
test(" function deleteDir",()=>
{  
//todo
})
/*

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

 
 

};
*/