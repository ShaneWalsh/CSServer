
export class PlayerData{

  private token:String;
  private data: any;

  // Stats
  private beef:number = 2;
  private brains:number = 2;
  private agility:number = 2;
  private charm:number = 2;
  private aim:number = 2;

  // Equipment
  private torsoEq;
  private headEq;
  private handEq;
  private legsEg;
  private amuletEq;
  private ringLeftEq;
  private ringRightEq;

  constructor(token, responseData) {
    this.token = token;
    this.data = responseData;
    // convert data here into attributes to be set.
  }

  getUsername(): String {
      return this.data.username;
  }

  getToken():String{
    return this.token;
  }

  getBeef():number{
    return this.beef;
  }
  getBeefTotal():number{
    return this.beef;
  }

  getBrains():number{
    return this.brains;
  }
  getBrainsTotal():number{
    return this.brains;
  }

  getAgility():number{
    return this.agility;
  }
  getAgilityTotal():number{
    return this.agility;
  }

  getCharm():number{
    return this.charm;
  }
  getCharmTotal():number{
    return this.charm;
  }

  getAim():number{
    return this.aim;
  }
  getAimTotal():number{
    return this.aim;
  }

}
