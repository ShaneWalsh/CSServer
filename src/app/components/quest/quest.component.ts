import { Component, OnInit, Input } from '@angular/core';
import { PartySocketService } from 'src/app/services/party-socket.service';
import { QuestSocketService } from 'src/app/services/quest-socket.service';
import { QuestData } from 'src/app/model/QuestData';
import { StoryNode } from 'src/app/model/StoryNode';
import { ChoiceNode } from 'src/app/model/ChoiceNode';
import { Subscription } from 'rxjs';
import { QuestAction } from 'src/app/model/QuestAction';
import { OptionsService } from 'src/app/services/options.service';
import { LoginSocketService } from 'src/app/services/login-socket.service';
import { PlayerData } from 'src/app/model/PlayerData';

@Component({
  selector: 'app-quest',
  templateUrl: './quest.component.html',
  styleUrls: ['./quest.component.css']
})
export class QuestComponent implements OnInit {

  private questId:number;
  private questData:QuestData;

  private questContainer:any; // used for any and all local variables set by the quest. e.g states etc.

  private currentStoryNode:StoryNode;
  private voteTimer:number = -1;

  private canVotesBeChanged:boolean=true;
  private votesShown:boolean=false;
  private hasVoted:boolean = false;

  private subscriptionPartyVoteSubject: Subscription;
  private interval: any;

  constructor(private partySocketService:PartySocketService,
              private questSocketService:QuestSocketService,
              private optionsService:OptionsService,
              private loginSocketService:LoginSocketService) {
    this.canVotesBeChanged = this.optionsService.voteCanBeChange;
    this.votesShown = this.optionsService.votesShown;

    this.questId = this.partySocketService.getPartyQuestId();
    this.questData = this.questSocketService.getQuest(this.questId);
    // once we have the quest, we should get a playable instance.
    this.currentStoryNode = new StoryNode(this.getQData().startingStoryNodeId,
        this.getQData().stories[this.getQData().startingStoryNodeId],
        this.getQData().choice,
        this.partySocketService.getMembers());
    this.currentStoryNode.performReplacements(this.loginSocketService.getPlayerData(), this.questContainer);
    // and start running through it!

    this.subscriptionPartyVoteSubject = this.partySocketService.getPartyVoteSubject().subscribe(questAction => {
      this.handlePartyAction(questAction);
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

  private getChosenVote():ChoiceNode{
      // is clear winner,
      let biggest = 0;
      let choiceChoice:ChoiceNode = null;
      for(let choice of this.currentStoryNode.getChoiceNodes()){
        if(choice.getVotes().length > biggest){
          biggest = choice.getVotes().length;
          choiceChoice = choice;
        } else if(choice.getVotes().length == biggest){
          choiceChoice = null; // we are undecied then because there is at least two elements with the same size. if there is a bigger one he will set the choice.
        }
      }

      if(choiceChoice == null){ // find biggest set and chose one of them at random. because none was found above
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
        choiceChoice = choicesTemp[pos];
      }
      return choiceChoice;
  }

  private sendChoiceToParty(){
    this.clearTimer();
    let choice:ChoiceNode = this.getChosenVote();

    // if this choice has any actions decide, execute them now!
    let taskData = choice.executeTask(this.partySocketService.getMembers());
    this.partySocketService.sendChosenVote(choice.getId(), taskData);

    //todo _s remove
    // let members = this.partySocketService.getMembers()
    // for(let playerData of members){
    //   console.log(playerData.getUsername() +" Hoooo ");
    // }
  }

  handlePartyAction(questAction: QuestAction) {
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

      // what kind of choice is this? could be a task, if so, execute the task!
      // intelligent defaults. first/only story selected from the choice node, and display nothing before content.
      let chosenChoiceNode:ChoiceNode = this.currentStoryNode.getChoiceNodeWithId(questAction.getData().choiceId);
      let storyId = chosenChoiceNode.getStoryId(); // postion 0 for defaults, 0/1 for actions.

      if(chosenChoiceNode.hasTask()){
        let taskData: any = questAction.getTaskData(); // {"roll":roll, "bonus":bonus, "success":success}
        if(taskData.success){
          storyId = chosenChoiceNode.getStoryIds()[1]; // else can leave it at the default zero above.
        }
        console.log("Rolling..."+taskData.roll+ " Bonus:"+taskData.bonus + "Success:"+taskData.success);
        //todo _s  display the roll info to the users? after short timeout, switch to this node???
        this.currentStoryNode = new StoryNode(storyId,this.getQData().stories[storyId], this.getQData().choice,this.partySocketService.getMembers());
        this.currentStoryNode.performReplacements(this.getChosenPlayer(chosenChoiceNode), this.questContainer);
      } else {
        this.currentStoryNode = new StoryNode(storyId,this.getQData().stories[storyId], this.getQData().choice,this.partySocketService.getMembers());
        this.currentStoryNode.performReplacements(this.getChosenPlayer(chosenChoiceNode), this.questContainer);
      }

    }
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

  getChosenPlayer(choiceNode:ChoiceNode):PlayerData {
    let chosenPlayer:PlayerData =choiceNode.getChosenPlayer();
    if(chosenPlayer == null){
      chosenPlayer= this.loginSocketService.getPlayerData();
    }
    return chosenPlayer;
  }

  ngOnDestroy() {
      this.subscriptionPartyVoteSubject.unsubscribe();
  }

}
