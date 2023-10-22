import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

}
