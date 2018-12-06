
export class PlayerData{

  private token:String;
  private data: any;

  constructor(token, responseData) {
    this.token = token;
    this.data = responseData;
  }

  getUsername(): String {
      return this.data.username;
  }

  getToken():String{
    return this.token;
  }

}
