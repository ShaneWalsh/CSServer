
export class QuestData{

  private name: string;
  private description: string;
  private data:any;

  constructor(name, description, data) {
    this.description = description;
    this.name = name;
    this.data = data;
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
