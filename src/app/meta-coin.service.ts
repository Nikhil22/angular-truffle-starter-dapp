import {Injectable} from '@angular/core';
import {ContractEnum, PongContract, PongDeployed, PongStaticData} from "./app.component";
import {
  InitializeContract, DeployedAndStaticData, ValuesContract, EthObservable, initializeContractHelper,
  hideValuesHelper,
  AppState,
  ContractValues, TruffleContract
} from "eth-observable";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";
const pong_artifacts = require('../../build/contracts/MetaCoin.json');
import Web3 from 'web3';

@Injectable()
export class MetaCoinService implements InitializeContract<ContractEnum>, ValuesContract<PongDeployed, PongStaticData> {
  private pongSource = new Subject<DeployedAndStaticData<PongDeployed, PongStaticData, string>>();
  pong$ = this.pongSource.asObservable();

  public dependsOnModifier = [false];

  constructor() {
  }


  getUniqueName(): ContractEnum {
    return ContractEnum.META_COIN;
  }


  initialize(contractFactoryService: EthObservable, contractsEnum: InitializeContract<ContractEnum>, app: AppState): Observable<any> {
    return initializeContractHelper(contractFactoryService, this, this, pong_artifacts, this.pongSource, app);
  }

  hideValues(array: any[]): any[] {
    return hideValuesHelper(array, this.dependsOnModifier);
  }


  getContractValuesPromise(deployed: PongDeployed, web3: Web3, hideVal: InitializeContract<any>, account: string): Promise<ContractValues<PongDeployed, PongStaticData>> {
    const values = [deployed.getBalance.call(account, {
      from: account
    })];
    return Promise.all(hideVal.hideValues(values))
      .then(data => {
        return new PongContract(deployed, new PongStaticData(data[0]));
      });
  }
}
