import { Component, OnInit, Input } from '@angular/core';
import { PartySocketService } from 'src/app/services/party-socket.service';
import { QuestSocketService } from 'src/app/services/quest-socket.service';
import { QuestData } from 'src/app/model/QuestData';
import { StoryNode } from 'src/app/model/StoryNode';
import { ChoiceNode } from 'src/app/model/ChoiceNode';
import { Subscription } from 'rxjs';
import { QuestAction } from 'src/app/model/QuestAction';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.css']
})
export class QuestComponent implements OnInit {

  private questId:number;
  private questData:QuestData;

  private currentStoryNode:StoryNode;
  private subscriptionPartyVoteSubject: Subscription;

  constructor(private partySocketService:PartySocketService, private questSocketService:QuestSocketService) {
    this.questId = this.partySocketService.getPartyQuestId();
    this.questData = this.questSocketService.getQuest(this.questId);
    // once we have the quest, we should get a playable instance.
    this.currentStoryNode = new StoryNode(this.getQData().startingStoryNodeId,this.getQData().stories[this.getQData().startingStoryNodeId], this.getQData().choice);
    // and start running through it!

    this.subscriptionPartyVoteSubject = this.partySocketService.getPartyVoteSubject().subscribe(questAction => {
      this.handleVote(questAction);
    });
  }

  getQData():any{
    return this.questData.getData()["default"];
  }

  public choose(choiceNode:ChoiceNode){
    console.log(choiceNode);
    this.partySocketService.vote(choiceNode.getId());
  }



  handleVote(questAction: QuestAction) {
    console.log("Choice "+questAction.getData().choiceId);
  }


  ngOnInit() {
  }

  ngOnDestroy() {
      this.subscriptionPartyVoteSubject.unsubscribe();
  }

}
