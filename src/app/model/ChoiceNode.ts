import { ChoiceType } from "src/app/model/enum/ChoiceType";
import { PlayerData } from "src/app/model/PlayerData";



export class ChoiceNode{

  private _id : any;
  private _text: string;
  private _storyId: any;
  private _show:boolean = true; // by default all choices should be visible unless condition says otherwise.

  private _type:ChoiceType = ChoiceType.default;
  private _typeStr:string = "";
  private _hasTask:boolean = false;
  private _taskRoll:number = 0; // the roll value required for the action to be a success.
  private _chosenPlayer:PlayerData = null;

  private _votes:string[] = [];

  constructor(id, choiceData, playerData:PlayerData[]) {
    this._id = id;
    this._text = choiceData.text;
    this._storyId = choiceData.story;

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
        this._chosenPlayer = this.findHighestStat(playerData);

        // todo _s replace strings in the
        this._text = this.performReplacements(this._text,this._chosenPlayer);
      }
    }
    // add functions to execute

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
    return this._storyId;
  }

  hasTask(): boolean {
      return this._hasTask;
  }

  getChosenPlayer(){
    return this._chosenPlayer;
  }

  performReplacements(text:string, playerData:PlayerData):string{
    text = text.replace("${player}",playerData.getUsername());
    return text;
  }

  findHighestStat(playerData:PlayerData[]):PlayerData{
      let highest= 0;
      let highestPlayer:PlayerData;
      for(let player of playerData){
        let val:number = this.getBouns(player);
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
        let roll = this.getRandomInt(20);
        let bouns:number = this.getBouns(playerData[0]);
        let taskRollCalculation = roll + " + ("+this._typeStr+") " + bouns;
        return {"taskRollCalculation":taskRollCalculation, "rollTotal":roll+bouns}
      } else {
        return {};
      }
  }

  getBouns(playerData:PlayerData):number{
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
