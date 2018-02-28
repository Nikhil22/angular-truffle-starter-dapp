import { Component, HostListener, NgZone } from '@angular/core';

import {Web3Service, MetaCoinService} from '../services/services'

// const contract = require('truffle-contract');
// const metaincoinArtifacts = require('../../build/contracts/MetaCoin.json');
import { canBeNumber } from '../util/validation';
import { environment } from '../environments/environment';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  // MetaCoin = contract(metaincoinArtifacts);

  // TODO add proper types these variables
  account: any;
  accounts: any;
  // web3: any;

  balance: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  canBeNumber = canBeNumber;

  constructor(
    private _ngZone: NgZone,
    private Web3Service: Web3Service,
    private MetaCoinService: MetaCoinService,
    ) {
    this.onReady();
  }

  onReady = () => {

    // Get the initial account balance so it can be displayed.
    this.Web3Service.GetAccounts().subscribe(accs => {
      this.accounts = accs;
      this.account = this.accounts[0];

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      this._ngZone.run(() =>
        this.refreshBalance()
      );
    }, err => alert(err))
  };

  refreshBalance = () => {
    this.MetaCoinService.GetBalance(this.account)
      .subscribe(value => {
        this.balance = value
      }, e => {this.setStatus('Error getting balance; see log.')})
  };

  setStatus = message => {
    this.status = message;
  };

  // sendCoin = () => {
  //   const amount = this.sendingAmount;
  //   const receiver = this.recipientAddress;
  //   let meta;

  //   this.setStatus('Initiating transaction... (please wait)');

  //   this.MetaCoin
  //     .deployed()
  //     .then(instance => {
  //       meta = instance;
  //       return meta.sendCoin(receiver, amount, {
  //         from: this.account
  //       });
  //     })
  //     .then(() => {
  //       this.setStatus('Transaction complete!');
  //       this.refreshBalance();
  //     })
  //     .catch(e => {
  //       console.log(e);
  //       this.setStatus('Error sending coin; see log.');
  //     });
  // };
}
