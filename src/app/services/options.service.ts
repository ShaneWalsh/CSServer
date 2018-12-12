import { Injectable } from '@angular/core';

/**
 * Stores all of the configurable options in the app, which the user can set as they please.
 */
@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  // party options, should be set by the leader, maybe :/
  voteHasTimer:boolean = true; //
  voteTimerValue:number = 30; //
  voteCanBeChange:boolean = true; // if a user can change their vote after submitting it.
  votesShown:boolean = false; // show user votes by username;

  constructor() { }
}
