import { PlayerData } from "src/app/model/PlayerData";

export class Bot{

  protected hp:number = 10;
  protected attack:number = 1;

  protected _id : any;
  protected _level : number = 1;

  constructor(id:any, level:number=1, name:string = null) {
    this._id = id;
    this._level = level;
  }

  public chooseAttack(players:PlayerData[]){
    return players;
    // choose an attack and output the value.
      // pick a random player, or choose based on stats
    // return the chosen player + attack effect + attack string.
  }


  getId(): any {
    return this._id;
  }


}
