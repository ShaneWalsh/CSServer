import { PlayerData } from "src/app/model/PlayerData";

export class Replacer {
  constructor() { }

  // global container may not be required since
  static performReplacements(wholeText:string,chosenPlayer:PlayerData, partyPlayers:PlayerData[], questContainer:any,globalContainer:any):string{
    if(wholeText != null){
      if(chosenPlayer != null){
        wholeText = this.replace(wholeText, "${player}",chosenPlayer.getUsername());
        wholeText = this.replace(wholeText, "${playerGender}",chosenPlayer.getUsername());
      }
      if(partyPlayers != null){

      }
      if(questContainer !=null){

      }
      if(globalContainer != null){ // the chosen player is not the same as your player. So this is your pllayers container.

      }
      wholeText = this.replace(wholeText, "${partyNick}","random value"); // this can be random for everybody, who cares right its just for fun.

      // allplay action logic.
      if(wholeText.indexOf("${pp") > -1){
        let wholeTextStart = wholeText.substring(0,wholeText.indexOf("${pp"));
        let wholeTextPP = wholeText.substring(wholeText.indexOf("${pp")+4,wholeText.indexOf("pp}"));
        let wholeTextEnd = wholeText.substring(wholeText.indexOf("pp}")+3);
        //wholeTextPP = this.replace(wholeTextPP, "${pp","");wholeTextPP = this.replace(wholeTextPP, "pp}","");
        if(questContainer.passPlayers){
          wholeText = wholeTextStart + this.replace(wholeTextPP, "${passPlayers}",questContainer.passPlayers) + wholeTextEnd;
        } else { // no pass players, cut them out then.
          wholeText = wholeTextStart + wholeTextEnd;
        }
      }
      if(wholeText.indexOf("${ff") > -1){
        let wholeTextStart = wholeText.substring(0,wholeText.indexOf("${ff"));
        let wholeTextFF = wholeText.substring(wholeText.indexOf("${ff")+4,wholeText.indexOf("ff}"));
        let wholeTextEnd = wholeText.substring(wholeText.indexOf("ff}")+3);
        //wholeTextFF = this.replace(wholeTextFF, "${ff","");wholeTextFF = this.replace(wholeTextFF, "ff}","");
        if(questContainer.failPlayers){
          wholeText = wholeTextStart + this.replace(wholeTextFF, "${failPlayers}",questContainer.failPlayers) + wholeTextEnd;
        } else { // no fail players, cut them out then.
          wholeText = wholeTextStart + wholeTextEnd;
        }
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
