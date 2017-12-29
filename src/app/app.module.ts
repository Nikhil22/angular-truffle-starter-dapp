import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {MetaCoinService} from "./meta-coin.service";
import {
  InitializeContract, DeployedAndStaticData, ValuesContract, EthObservable, initializeContractHelper,
  hideValuesHelper,
  AppState,
  ContractValues, TruffleContract
} from "eth-observable";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [MetaCoinService, EthObservable],
  bootstrap: [AppComponent]
})
export class AppModule {
}
