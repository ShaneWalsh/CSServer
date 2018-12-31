import { PlayerData } from "src/app/model/PlayerData";

export class Replacer {
  constructor() { }

  // global container may not be required since
  static performReplacements(wholeText:string,chosenPlayer:PlayerData, partyPlayers:PlayerData[], questContainer:any,globalContainer:any):string{
    if(wholeText != null){
      if(chosenPlayer != null){
        wholeText = this.replace(wholeText, "${player}",chosenPlayer.getUsername());
      }
      if(partyPlayers != null){

      }
      if(questContainer !=null){

      }
      if(globalContainer != null){ // the chosen player is not the same as your player. So this is your pllayers container.

      }
      return wholeText;
    }
    return "";
  }

  private static replace(wholeText:string,match:string, replacement:any):string{
    while(wholeText.indexOf(match) > -1){
      wholeText = wholeText.replace(match,replacement);
    }
    return wholeText;
  }

}
