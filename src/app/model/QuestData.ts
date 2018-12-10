
export class QuestData{

  private questId: number;
  private name: string;
  private description: string;
  private data:any;


  constructor(questId, name, description, data) {
    this.questId = questId;
    this.description = description;
    this.name = name;
    this.data = data;
  }

  getQuestId():number {
    return this.questId;
  }

  getName(): String {
      return this.name;
  }

  getDescription():string{
    return this.description;
  }

  getData():any{
    return this.data;
  }


}
