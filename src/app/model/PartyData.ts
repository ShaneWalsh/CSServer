import { PlayerData } from "src/app/model/PlayerData";

export class PartyData{

  private partyId:any;
  private partyMembers:PlayerData[];

  constructor(response) {
    this.partyId = response.partyId;
    this.partyMembers = []; // merge the parties player data.
    for(let i = 0; i < response.membersData.length;i++){
      this.partyMembers.push(new PlayerData("",response.membersData[i]));
    }
  }

  public getPartyId():any{
    return this.partyId;
  }

  public getMembers():PlayerData[]{
    return this.partyMembers;
  }
}
