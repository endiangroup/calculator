import { Component, HostBinding } from '@angular/core';

import { routeAnimations } from '@app/core';
import { environment as env } from '@env/environment';

import {
  NIGHT_MODE_THEME,
  selectorSettings,
  SettingsState,
  ActionSettingsChangeAnimationsPageDisabled
} from './settings';

interface Package {
  name: string;
  cost: number;
  rate: number;
}

interface Packages {
  [name: string]: Package;
}

var packages: Packages = {
  solo: {
    name: 'Solo',
    cost: 16000,
    rate: 4
  },
  team: {
    name: 'Team',
    cost: 24000,
    rate: 8
  }
};

@Component({
  selector: 'calculator-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations]
})
export class AppComponent {
  @HostBinding('class') componentCssClass;

  numberOfMonths = 3;
  numberOfHires = 7;
  actualMonths = 0;
  cost = 16000;
  salaryTotal = 0;
  recruiterCost = 0;
  savings = 0;
  savingsPercent = 0;

  yourPackage: Package = undefined;

  constructor() {
    this.componentCssClass = 'default-theme';
    this.onChange();
  }

  onChange() {
    var found: Package = null;

    for (const k in packages) {
      if (packages[k].rate * this.numberOfMonths >= this.numberOfHires) {
        if (!found || packages[k].rate < found.rate) {
          found = packages[k];
        }
      }
    }

    this.yourPackage = found;
    this.actualMonths = Math.ceil(this.numberOfHires / this.yourPackage.rate);

    if (this.actualMonths < 3) {
      this.actualMonths = 3;
    }

    this.cost = this.actualMonths * this.yourPackage.cost;
    this.recruiterCost = this.salaryTotal * 0.2;
    this.savings = this.recruiterCost - this.cost;
    this.savingsPercent = (1 - this.cost / this.recruiterCost) * 100;
  }
}
