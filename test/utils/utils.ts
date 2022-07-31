import test from 'ava';
import { fileURLToPath } from 'url';
import Config from '../../src/config';
import Utils from '../../src/utils';

test(" function addExtensionType",test=>{
for (const types of Config.supportedConfigTypes)
{
// test absolute
    let  value= Utils.addExtensionType(fileURLToPath(new URL("TEST"+types, import.meta.url)),Config.supportedConfigTypes)
    if (value ==="None")
{
test.fail()
}
// test relative 
value= Utils.addExtensionType("TEST"+types,Config.supportedConfigTypes)
if (value ==="None")
{
test.fail()
}
}    
test.pass()
})