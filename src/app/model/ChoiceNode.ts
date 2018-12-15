import { ChoiceType } from "src/app/model/enum/ChoiceType";



export class ChoiceNode{

  private _id : any;
  private _text: string;
  private _storyId: any;
  private _show:boolean = true; // by default all choices should be visible unless condition says otherwise.
  private _type:ChoiceType = ChoiceType.default;
  private _hasTask:boolean = false;

  private _votes:string[] = [];

  constructor(id, choiceData) {
    this._id = id;
    this._text = choiceData.text;
    this._storyId = choiceData.story;

    if(choiceData.choiceType){
      if(choiceData.choiceType == "default")
        this._type = ChoiceType.default;
      else if(choiceData.choiceType == "beefTask"){
        this._type = ChoiceType.beefTask;
        this._hasTask = true;
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

}
