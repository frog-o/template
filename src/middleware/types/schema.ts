export interface variablesData
{
[index: string]: string;
}
export interface filterData
{
noCopy?:string[]
noParse?:string[]
}
export interface schemaDate
{
filter?:unknown 
variablesOrder ?:string[]
variables?:variablesData
}