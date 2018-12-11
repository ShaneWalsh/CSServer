
export class ChoiceNode{


  private _id : any;
  private _text: string;
  private _storyId: any;
  private _show:boolean = true; // by default all choices should be visible unless condition says otherwise.

  constructor(id, choiceData) {
    this._id = id;
    this._text = choiceData.text;
    this._storyId = choiceData.story;

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

}
