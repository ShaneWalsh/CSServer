import { ChoiceType } from "src/app/model/enum/ChoiceType";
import { PlayerData } from "src/app/model/PlayerData";
import { Replacer } from "src/app/services/replacer";



export class ChoiceNode{

  private _id : any;
  private _text: string;
  private _storyIds: any[]; // first/only node is the default, standard text or task failure. Position 2 is the task success node.
  private _show:boolean = true; // by default all choices should be visible unless condition says otherwise.

  private _type:ChoiceType = ChoiceType.default;
  private _typeStr:string = "";
  private _hasTask:boolean = false;
  private _taskRoll:number = 0; // the roll value required for the action to be a success.
  private _chosenPlayer:PlayerData = null;

  private _multiPlayer:boolean =false; // if true, means that this option should be presented for every player.
  // OR, its is either _multiPlayer or allPlay cannot be both.
  private _allPlay:boolean = false; // by default all tasks are single player. But when allPlay is true, its for all players a group task.
  private _allMustPass:boolean = false; // when allPlay true, if allMustPass is true means all players must pass to get to option 1, else option 2 is chosen. false, only one has to pass.

  private _votes:string[] = [];

  constructor(id, choiceData, playerData:PlayerData[]) {
    this._id = id;
    this._text = choiceData.text;
    this._storyIds = choiceData.story;

    if(choiceData.multiPlayer != null && choiceData.multiPlayer == true){
      this._multiPlayer = true;
    }

    if(choiceData.allPlay != null && choiceData.allPlay == true){
      this._allPlay = true;
      if(choiceData.allMustPass != null && choiceData.allMustPass == true){
        this._allMustPass = true;
      }
    }

    if(choiceData.chosenPlayer != null){
        this._chosenPlayer = choiceData.chosenPlayer;
    }

    if(choiceData.choiceType){
      if(choiceData.choiceType == "default"){
        this._type = ChoiceType.default;
      }
      else{
        if(choiceData.choiceType == "beefTask"){
          this._type = ChoiceType.beefTask;
          this._taskRoll = choiceData.taskRoll;
          this._hasTask = true;
          this._typeStr = "beef";
        }
        if(this._chosenPlayer == null && !this._allPlay){
          this._chosenPlayer = this.findHighestStat(playerData);
        }
      }
    }

    if(this._chosenPlayer != null){
      this._id = this._id +"-"+this._chosenPlayer.getUsername();
    }

  }

  performReplacements(chosenPlayer:PlayerData, questContainer:any){
    this._text = Replacer.performReplacements(this._text,this._chosenPlayer, null, questContainer,null);
  }

  getId(): any {
    return this._id;
  }

  getText():string{
    return this._text;
  }

  shouldShow():boolean{
    return this._show;
  }

  getStoryId():any{
    return this._storyIds[0];
  }

  getStoryIds():any[]{
    return this._storyIds;
  }

  hasTask(): boolean {
      return this._hasTask;
  }

  isMultiPlayer():boolean{
    return this._multiPlayer;
  }

  isAllPlay():boolean{
    return this._allPlay;
  }

  isAllMustPass():boolean{
    return this._allMustPass;
  }

  getChosenPlayer(){
    return this._chosenPlayer;
  }

  findHighestStat(playerData:PlayerData[]):PlayerData{
      let highest= 0;
      let highestPlayer:PlayerData;
      for(let player of playerData){
        let val:number = this.getBonus(player);
        if(val > highest){
          highest = val;
          highestPlayer = player;
        }
      }
      return highestPlayer;
  }

  // execute the task if there is one.
  executeTask(playerData:PlayerData[]): any {
      if(this.hasTask()){
        if(!this._allPlay){
          let player:PlayerData = this._chosenPlayer;
          if(player ==null){
            player = playerData[0];
          }
          let success:boolean = false;
          let roll = this.getRandomInt(20);
          let bonus:number = this.getBonus(player);
          if(this._taskRoll <= (roll+bonus)){
            success = true;
          }
          return {"name":player.getUsername(), "roll":roll, "bonus":bonus, "success":success}
        } else { // this is an all play
            // so roll for every player, save all results
            let success:boolean = false;
            let fail:boolean = false;
            let passPlayers = [];
            let failPlayers = [];
            for(let player of playerData){
              let roll = this.getRandomInt(20);
              let bonus:number = this.getBonus(player);
              if(this._taskRoll > (roll+bonus)){
                fail = true;
                failPlayers.push({"name":player.getUsername(), "roll":roll, "bonus":bonus, "success":success})
              } else {
                success = true;
                passPlayers.push({"name":player.getUsername(), "roll":roll, "bonus":bonus, "success":success})
              }
            }
            let passTask = false;  // if _allMustPass, then any failure means success = false;
            if(this._allMustPass && fail){ // fail // all have to pass and one failed
              passTask = false;
            } else if(this._allMustPass && !fail) { // pass  // all have to pass and none failed
              passTask = true;
            } else if(!this._allMustPass && success) { // pass  // only one has to pass and they have so success
              passTask = true;
            } else if(!this._allMustPass && !success) { // fail  // only one has to pass and none have so
              passTask = false;
            }
            return {"success":passTask, "passPlayers":passPlayers, "failPlayers":failPlayers}
        }
      } else {
        return {};
      }
  }

  getBonus(playerData:PlayerData):number{
    if(this._type == ChoiceType.beefTask){
      return playerData.getBeefTotal();
    }
  }

  getVotes():string[]{
    return this._votes;
  }

  addVote(username: string){
    const index = this._votes.indexOf(username, 0);
    if (index == -1) {
       this._votes.push(username);
    }
  }

  removeVote(username: any): any {
    const index = this._votes.indexOf(username, 0);
    if (index > -1) {
       this._votes.splice(index, 1);
    }
  }

  getRandomInt(max) { // e.g 3 = 1,2,3
    return (Math.floor(Math.random() * Math.floor(max)))+1;
  }
}
