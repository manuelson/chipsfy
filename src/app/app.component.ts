import { Component, NgZone } from '@angular/core';
import { Platform, NavController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BLE } from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
    devices: any[] = [];
    statusMessage: string;

    constructor(public navCtrl: NavController,
                private toastCtrl: ToastController,
                private ble: BLE,
                private ngZone: NgZone) {
    }

    ionViewDidEnter() {
        console.log('ionViewDidEnter');
        this.scan();
    }

    scan() {
        this.setStatus('Scanning for Bluetooth LE Devices');
        this.devices = [];  // clear list

        this.ble.scan([], 5).subscribe(
            device => this.onDeviceDiscovered(device),
            error => this.scanError(error)
        );

        setTimeout(this.setStatus.bind(this), 5000, 'Scan complete');
    }

    onDeviceDiscovered(device) {
        console.log('Discovered ' + JSON.stringify(device, null, 2));
        this.ngZone.run(() => {
            this.devices.push(device);
        });
    }

    // If location permission is denied, you'll end up here
    scanError(error) {
        this.setStatus('Error ' + error);
        let toast = this.toastCtrl.create({
            message: 'Error scanning for Bluetooth low energy devices',
            position: 'middle',
            duration: 5000
        });

    }

    setStatus(message) {
        console.log(message);
        this.ngZone.run(() => {
            this.statusMessage = message;
        });
    }


  /*initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }*/
}
