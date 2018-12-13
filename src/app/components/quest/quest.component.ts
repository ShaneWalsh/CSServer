import { Component, OnInit, Input } from '@angular/core';
import { PartySocketService } from 'src/app/services/party-socket.service';
import { QuestSocketService } from 'src/app/services/quest-socket.service';
import { QuestData } from 'src/app/model/QuestData';
import { StoryNode } from 'src/app/model/StoryNode';
import { ChoiceNode } from 'src/app/model/ChoiceNode';
import { Subscription } from 'rxjs';
import { QuestAction } from 'src/app/model/QuestAction';
import { OptionsService } from 'src/app/services/options.service';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.css']
})
export class QuestComponent implements OnInit {

  private questId:number;
  private questData:QuestData;

  private currentStoryNode:StoryNode;
  private voteTimer:number = -1;

  private canVotesBeChanged:boolean=true;
  private votesShown:boolean=false;
  private hasVoted:boolean = false;

  private subscriptionPartyVoteSubject: Subscription;
  private interval: any;

  constructor(private partySocketService:PartySocketService, private questSocketService:QuestSocketService, private optionsService:OptionsService) {
    this.canVotesBeChanged = this.optionsService.voteCanBeChange;
    this.votesShown = this.optionsService.votesShown;

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
    if(this.canVotesBeChanged || !this.hasVoted){
      this.partySocketService.vote(choiceNode.getId());
      this.hasVoted = true;
    }
  }



  handleVote(questAction: QuestAction) {
    if(questAction.getAction() == "vote"){
      let choices:ChoiceNode[] = this.currentStoryNode.getChoiceNodes();
      for(let choice of choices){
        if(choice.getId() == questAction.getData().choiceId){
          choice.addVote(questAction.getData().username);
        } else { // remove previous votes by him on any other choice if he made one.
          choice.removeVote(questAction.getData().username);
        }
      }
      if(this.optionsService.voteHasTimer){
        if(this.voteTimer == -1){ // then there is no vote in progress so start one.
          this.startTimer();
        }
      }

      // now if we are the leader, and all votes have been cast, then that choice is selected, so triggerChoice.
      if(this.partySocketService.isPartyLeader()){
        // has everyone voted.
        let votesCast = 0;
        for(let choice of this.currentStoryNode.getChoiceNodes()){
          votesCast += choice.getVotes().length;
        }
        if(votesCast == this.partySocketService.getPartySize()){
          this.sendChoiceToParty();
        }
      }
    } else if(questAction.getAction() == "chosenVoteAction"){ // move the quest along!
      this.clearTimer(); // might be called multiple times, by the leader and then by slaves.
      let storyId = this.getQData().choice[questAction.getData().choiceId].story;
      this.currentStoryNode = new StoryNode(storyId,this.getQData().stories[storyId], this.getQData().choice);
    }
  }

  private getChosenVote():any{
      // is clear winner,
      let biggest = 0;
      let choiceChoice:any = -1;
      for(let choice of this.currentStoryNode.getChoiceNodes()){
        if(choice.getVotes().length > biggest){
          biggest = choice.getVotes().length;
          choiceChoice = choice.getId();
        } else if(choice.getVotes().length == biggest){
          choiceChoice = -1; // we are undecied then because there is at least two elements with the same size. if there is a bigger one he will set the choice.
        }
      }

      if(choiceChoice == -1){ // find biggest set and chose one of them at random. because none was found above
        biggest = 0; // coin flip between options.
        for(let choice of this.currentStoryNode.getChoiceNodes()){
          if(choice.getVotes().length > biggest){
            biggest = choice.getVotes().length;
          }
        }

        let choicesTemp:ChoiceNode[] = [];
        for(let choice of this.currentStoryNode.getChoiceNodes()){
          if(choice.getVotes().length == biggest){
            choicesTemp.push(choice);
          }
        }

        let pos = Math.floor(Math.random() * choicesTemp.length);
        choiceChoice = choicesTemp[pos].getId();
      }
      return choiceChoice;
  }

  private sendChoiceToParty(){
    this.clearTimer();
    let choice = this.getChosenVote();
    this.partySocketService.sendChosenVote(choice);
  }




  ngOnInit() {
  }

  clearTimer(){
    clearInterval(this.interval);
    this.hasVoted = false;
    this.voteTimer = -1;
  }

  startTimer() {
    this.voteTimer = this.optionsService.voteTimerValue;
    this.interval = setInterval(() => {
      if(this.voteTimer == 0 && this.partySocketService.isPartyLeader()){ // times up and we are the leader, submit it.
        this.sendChoiceToParty();
      }
      if(this.voteTimer > -1) {
        this.voteTimer--;
      }
    },1000)
  }


  ngOnDestroy() {
      this.subscriptionPartyVoteSubject.unsubscribe();
  }

}
