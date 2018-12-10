import { Component, OnInit, Input } from '@angular/core';
import { PartySocketService } from 'src/app/services/party-socket.service';
import { QuestSocketService } from 'src/app/services/quest-socket.service';
import { QuestData } from 'src/app/model/QuestData';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.css']
})
export class QuestComponent implements OnInit {

  private questId:number;
  private questData:QuestData;

  private currentStoryNode:any;

  constructor(private partySocketService:PartySocketService, private questSocketService:QuestSocketService) {
    this.questId = this.partySocketService.getPartyQuestId();
    this.questData = this.questSocketService.getQuest(this.questId);
    // once we have the quest, we should get a playable instance.
    this.currentStoryNode = this.getQData().stories[this.getQData().startingStoryNodeId];
    // and start running through it!

  }

  getQData():any{
    return this.questData.getData()["default"];
  }

  ngOnInit() {
  }

}
