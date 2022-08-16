import test from 'ava';
import Config from '../../src/config';
import Utils from '../../src/utils';
import { URL } from "url"
test(" function addExtensionType",test=>{
for (const types of Config.supportedConfigTypes)
{
// test absolute  
    let url = new URL("../config/TEST"+types,import.meta.url)
    let  value= Utils.addExtensionType(url,Config.supportedConfigTypes)
    if (value ==="None")
{
test.fail()
}
// test relative 
value= Utils.addExtensionType("../config/TEST"+types,Config.supportedConfigTypes)
if (value ==="None")
{
test.fail()
}
}    
test.pass()
})