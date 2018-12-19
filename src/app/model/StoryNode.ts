import { ChoiceNode } from "src/app/model/ChoiceNode";
import { PlayerData } from "src/app/model/PlayerData";


export class StoryNode {

  private _id: number;
  private _text: string;
  private _choices: any[]; // literal id array
  private _choiceNodes: ChoiceNode[]; // literal id array

  // add functions to execute
  // on load, so before it display.

  constructor(id, storyData, choiceData, playerData:PlayerData[]) {
    this._id = id;
    this._text = storyData.text;

    // function processor, execute now and let me know whats happening!

    this._choices = storyData.choice;
    this._choiceNodes = [];
    for (let i = 0; i < this._choices.length; i++) {
      //  todo _s  add checks to ensure these choices can be used.
      this._choiceNodes.push(new ChoiceNode(this._choices[i], choiceData[this._choices[i]], playerData));
    }
  }

  getText():string{
    return this._text;
  }

  getChoiceNodes():ChoiceNode[]{
    return this._choiceNodes;
  }

}
