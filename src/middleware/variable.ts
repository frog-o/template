
export class variableManager {
    _Data:unknown
    _Order:string[]
    constructor(Data:unknown=undefined,Order:string[]=[])
    {
    this._Data = Data
    this._Order= Order
    }
    getVariables()
    {
  
      return Object.getOwnPropertyNames(this._Data)
    }
    getOrder():string[]{
    return this._Order  
     
    }
  }
  