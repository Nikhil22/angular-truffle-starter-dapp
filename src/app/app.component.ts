import {Component, HostListener, NgZone, OnInit} from '@angular/core';
const Web3 = require('web3');
const contract = require('truffle-contract');
const metaincoinArtifacts = require('../../build/contracts/MetaCoin.json');
import {canBeNumber} from '../util/validation';
import {
  TruffleContract,
  ContractValues,
  EthObservable,
  DeployedAndStaticData,
  AppState
} from 'eth-observable';
import {MetaCoinService} from "app/meta-coin.service";

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  MetaCoin = contract(metaincoinArtifacts);
  pong: DeployedAndStaticData<PongDeployed, PongStaticData, string>;

  // TODO add proper types these variables
  account: any;
  accounts: any;
  web3: any;

  balance: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  canBeNumber = canBeNumber;

  constructor(private _ngZone: NgZone, private _ethObservable: EthObservable, private _pongService: MetaCoinService) {

  }

  ngOnInit(): void {
    this._ethObservable.createConnection(new Web3(new Web3.providers.HttpProvider('http://localhost:8545')));
    new Promise(res => {
      this._ethObservable.web3.eth.getAccounts((err, accs) => {
        if (err != null) {
          alert("There was an error fetching your accounts.");
          return;
        }
        if (accs.length === 0) {
          alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
          return;
        }
        this.accounts = accs;
        this.account = this.accounts[0];
        console.dir(this.accounts);
        return res(this.account);
      });
    }).then((k: string) => {
      const appState = new AppState(new Map(), new Map(), new Map(), k);
      this._ethObservable.getAccounts()
        .map(contractEnum => {
          this._ethObservable.getContract(appState.mapAllContractFunction.get(contractEnum), appState);
          return contractEnum;
        })
        .subscribe();
      this._pongService.pong$.subscribe((data) => {
        this.pong = data;
      });
      this.initialize(appState).subscribe();
    });

  }

  @HostListener('window:load')
  windowLoaded() {
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  initialize(appState: AppState) {
    return this._pongService.initialize(this._ethObservable, this._pongService, appState);
  }


  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.warn(
        'Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        'No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider('http://localhost:8545')
      );
    }
  };

  onReady = () => {
    // Bootstrap the MetaCoin abstraction for Use.
    this.MetaCoin.setProvider(this.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert(
          'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
        );
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      this._ngZone.run(() =>
        this.refreshBalance()
      );
    });
  };

  refreshBalance = () => {
    let meta;
    this.MetaCoin
      .deployed()
      .then(instance => {
        meta = instance;
        return meta.getBalance.call(this.account, {
          from: this.account
        });
      })
      .then(value => {
        this.balance = value;
      })
      .catch(e => {
        console.log(e);
        this.setStatus('Error getting balance; see log.');
      });
  };

  setStatus = message => {
    this.status = message;
  };

  sendCoin = () => {
    const amount = this.sendingAmount;
    const receiver = this.recipientAddress;
    let meta;

    this.setStatus('Initiating transaction... (please wait)');

    this.MetaCoin
      .deployed()
      .then(instance => {
        meta = instance;
        return meta.sendCoin(receiver, amount, {
          from: this.account
        });
      })
      .then(() => {
        this.setStatus('Transaction complete!');
        this.refreshBalance();
      })
      .catch(e => {
        console.log(e);
        this.setStatus('Error sending coin; see log.');
      });

    this.pong.deployed.sendCoin(receiver, amount, {from: this.pong.getYourAccount()});
    this._ethObservable.refresh(this._pongService);
  };
}
export enum ContractEnum {
  META_COIN
}
export class PongStaticData {
  constructor(public pongval: string) {
  }
}
export interface PongDeployed extends TruffleContract {
  sendCoin(receiver, amount, from),
  getBalance
}


export class PongContract implements ContractValues<PongDeployed, PongStaticData> {

  constructor(public deployed: PongDeployed, public contract: PongStaticData) {
  }

  getDeployed(): PongDeployed {
    return this.deployed;
  }

  getStaticData(): PongStaticData {
    return this.contract;
  }
}
