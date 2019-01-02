import { PlayerData } from "src/app/model/PlayerData";

export class PartyData{

  private partyId:any;
  private partyMembers:PlayerData[];

  private partyName:string;
  private partyDescription:string;
  private partySize:number;
  private publicParty:boolean = false;
  private leader:string;

  constructor(response) {
    this.partyId = response.partyId;
    this.partyMembers = []; // merge the parties player data.
    for(let i = 0; i < response.membersData.length;i++){
      this.partyMembers.push(new PlayerData("",response.membersData[i]));
    }

    if(response.partyName != null){
      this.partyName = response.partyName;
    }

    if(response.partyDescription != null){
      this.partyDescription = response.partyDescription;
    }

    if(response.partySize != null){
      this.partySize = response.partySize;
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
