import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonConfig } from 'src/app/core/comps/button/button.component';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {

  buttonConfig: ButtonConfig = {
    label: 'Navigate Home',
    backgroundColor: 'var(--unnamed-color-2e8ff0)',
    color: 'var(--unnamed-color-ffffff)',
    boxShadow: '0px 5px 8px var(--unnamed-color-2e8ff0)',
    action: this.goToHome.bind(this)
  }

  constructor(
    private router: Router
  ) {}

  goToHome() {
    this.router.navigate(['/']);
  }
}
