import { Component, HostBinding, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { routeAnimations } from '@app/core';
import { environment as env } from '@env/environment';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';

import {
  NIGHT_MODE_THEME,
  selectorSettings,
  SettingsState,
  ActionSettingsChangeAnimationsPageDisabled
} from './settings';

interface Package {
  name: string;
  desc: string;
  cost: number;
  highRate: number;
  lowRate: number;
}

interface Packages {
  [name: string]: Package;
}

var packages: Packages = {
  solo: {
    name: 'Solo Talent',
    desc:
      'A dynamic and highly experienced recruitment specialist will come to work with you in-house, absorb your work culture, review CVs, pre-interview potential candidates, and generally take the hiring strain for as long as you need. You lucky devil.',
    cost: 16000,
    highRate: 5,
    lowRate: 2
  },
  team: {
    name: 'Duo Talent',
    desc:
      'A well-oiled (not lierally) superteam of two highly experienced recruitment specialists will come to work with you in-house, absorb your work culture, review CVs, pre-interview potential candidates, and generally take the hiring strain for as long as you need. Available with or without high-fives as the hires roll in.',
    cost: 24000,
    highRate: 10,
    lowRate: 7
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
  mobileQuery: MediaQueryList;

  numberOfMonths = 3;
  numberOfHires = 7;
  actualMonths = 0;
  cost = 16000;
  salaryTotal = 300;
  recruiterCost = 0;
  savings = 0;
  savingsPercent = 0;
  recruiterFee = 20;

  yourPackage: Package = undefined;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.componentCssClass = 'default-theme';

    this.mobileQuery = media.matchMedia('(max-width: 800px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.onChange();
  }

  onChange() {
    var found: Package = null;

    for (const k in packages) {
      var avgRate = Math.ceil((packages[k].lowRate + packages[k].highRate) / 2);

      if (avgRate * this.numberOfMonths >= this.numberOfHires) {
        if (!found || packages[k].lowRate < found.lowRate) {
          found = packages[k];
        }
      }
    }

    this.yourPackage = found;
    this.actualMonths = Math.ceil(
      this.numberOfHires / this.yourPackage.lowRate
    );

    if (this.actualMonths > this.numberOfMonths) {
      this.actualMonths = this.numberOfMonths;
    }

    if (this.actualMonths < 3) {
      this.actualMonths = 3;
    }

    this.cost = this.actualMonths * this.yourPackage.cost;
    this.recruiterCost = this.salaryTotal * 1000 * (this.recruiterFee/100);
    this.savings = this.recruiterCost - this.cost;
    this.savingsPercent = (1 - this.cost / this.recruiterCost) * 100;
  }
}
