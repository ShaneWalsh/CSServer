import { Injectable } from '@angular/core';
import * as heroAcademyData from '../quest/HeroAcademy.json';
import { QuestData } from 'src/app/model/QuestData';

@Injectable({
  providedIn: 'root'
})
export class QuestSocketService {

  // all quests will have to be wired in here, maybe they will get their own folder?
  // only process and load them into memeory when they are needed.

  quests:QuestData[];

  constructor() {
    // init all of the Quest Data Objects here on start up, they wont be changing.
    this.quests = [];
    //let q = new QuestData("HeroAcademy","You and your friends have graduated the hero HeroAcademy! What are the chances that quest is waiting for you!",heroAcademyData);
    // this.quests[0].getData()["default"] to access quest data.
    this.quests.push(new QuestData("HeroAcademy","You and your friends have graduated the hero HeroAcademy! What are the chances that quest is waiting for you!",heroAcademyData));
  }

  getQuestList():QuestData[]{
    return this.quests;
  }

}
