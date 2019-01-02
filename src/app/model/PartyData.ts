import { PlayerData } from "src/app/model/PlayerData";

export class PartyData{

  private partyId:any;
  private partyMembers:PlayerData[]; // for your parties data
  private members:string[]; // for all parties members

  private partyName:string;
  private partyDescription:string;
  private partySize:number;
  private publicParty:boolean = false;
  private leader:string;

  constructor(response) {
    this.partyId = response.partyId;
    this.partyMembers = []; // merge the parties player data.
    this.members = [];
    if(response.membersData != null){
      for(let i = 0; i < response.membersData.length;i++){
        this.partyMembers.push(new PlayerData("",response.membersData[i]));
        this.members.push(response.membersData[i].username);
      }
    } else{
      this.members = response.members;
    }

    if(response.partyName != null){
      this.partyName = response.partyName;
    }

    if(response.partyDescription != null){
      this.partyDescription = response.partyDescription;
    }

    if(response.partySize != null){
      this.partySize = response.partySize;
    } else {
      this.partySize = this.partyMembers.length;
    }

    if(response.publicParty != null){
      this.publicParty = response.publicParty;
    }

    if(response.leader != null){
      this.leader = response.leader;
    }

  }

  public getPartyId():any{
    return this.partyId;
  }

  public getMembers():PlayerData[]{
    return this.partyMembers;
  }

  public getMembersUsernames():string[]{
    return this.members;
  }

  public getPartyName():string{
    return this.partyName;
  }

  public getPartyDescription():string{
    return this.partyDescription;
  }

  public getPartySize():number{
    return this.partySize;
  }

  public getPublicParty():boolean{
    return this.publicParty;
  }

  public getLeader():string{
    return this.leader;
  }

}
