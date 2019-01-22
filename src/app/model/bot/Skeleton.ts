import { PlayerData } from "src/app/model/PlayerData";
import { Bot } from "src/app/model/bot/Bot";

export class Skeleton extends Bot{

  constructor(id:any, level:number=1, name:string = null) {
    super(id,level,name);
  }

  // override
  public chooseAttack(players:PlayerData[]){
    return players;
    // choose an attack and output the value.
      // pick a random player, or choose based on stats
    // return the chosen player + attack type{blunt,slash,pierce,missile,spell} + attack string{ A skeleton slashes viciously at you with his own leg.}.
  }

}
