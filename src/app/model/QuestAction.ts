
export class QuestAction{
  private action: string;
  private data:any;


  constructor(action, data) {
    this.action = action;
    this.data = data;
  }

  getAction():string {
    return this.action;
  }

  getData():any{
    return this.data;
  }

  getTaskData(): any {
    return this.data.taskData;
  }

}
