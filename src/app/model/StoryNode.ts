import { ChoiceNode } from "src/app/model/ChoiceNode";
import { PlayerData } from "src/app/model/PlayerData";
import { Replacer } from "src/app/services/replacer";


export class StoryNode {
  private _id: number;
  private _text: string;
  private _choices: any[]; // literal id array
  private _choiceNodes: ChoiceNode[];

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

  getChoiceNodeWithId(id):ChoiceNode{
    for(let node of this.getChoiceNodes()){
      if(node.getId() == id){
        return node;
      }
    }
    console.log("ERROR we could not find the choice node with the id :"+id);
    //return this.getChoiceNodes()[0]; //
  }

  performReplacements(chosenPlayer:PlayerData, questContainer:any){
    this._text = Replacer.performReplacements(this._text, chosenPlayer, null, questContainer,null);
    for (let i = 0; i < this._choiceNodes.length; i++) {
      //  todo _s  add checks to ensure these choices can be used.
      this._choiceNodes[i].performReplacements(chosenPlayer,questContainer);
    }
  }
}
