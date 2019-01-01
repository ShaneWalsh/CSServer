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

  private _votes:string[] = [];

  constructor(id, choiceData, playerData:PlayerData[]) {
    this._id = id;
    this._text = choiceData.text;
    this._storyIds = choiceData.story;

    if(choiceData.multiPlayer != null && choiceData.multiPlayer == true){
      this._multiPlayer = true;
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
        if(this._chosenPlayer == null){
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
        return {"roll":roll, "bonus":bonus, "success":success}
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
