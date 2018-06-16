import { Component } from '@angular/core';
import { SharedDataService } from '../services/shared-data.service';
import * as shapeshift from 'shapeshift.io';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  shapeShiftModalStatus: Boolean = false;
  coinToShift: String = '';
  constructor(private shData: SharedDataService) {
    this.shData.modalStatus$.subscribe(
      res => {
        this.shapeShiftModalStatus = res;
      });
  }

  shift() {

    const withdrawalAddress = '1HQmfTAE2eHe3p3pohCjxLgmCdZ3tixCL7';
    const pair = 'eth_btc';

    // if something fails
    const options = {
      returnAddress: '0x79675361a118E86C2757B6D75dB8F57fD456c78E'
    };

    shapeshift.shift(withdrawalAddress, pair, options, function (err, returnData) {

      // ShapeShift owned BTC address that you send your BTC to
      const depositAddress = returnData.deposit;

      // you need to actually then send your BTC to ShapeShift
      // you could use module `spend`: https://www.npmjs.com/package/spend
      // spend(SS_BTC_WIF, depositAddress, shiftAmount, function (err, txId) { /.. ../ })

      // later, you can then check the deposit status
      shapeshift.status(depositAddress, function (error, status, data) {
        console.log('shapeshift - status', status, returnData); // => should be 'received' or 'complete'
      });
    });

    shapeshift.coins(function (err, coinData) {
      console.log('shapeshift - coins', coinData);
    });
    shapeshift.exchangeRate(pair, function (err, rate) {
      console.log('shapeshift - rate', rate);
    });

    shapeshift.marketInfo(pair, function (err, marketInfo) {
      console.log('shapeshift - market info', marketInfo);
    });
  }
}
