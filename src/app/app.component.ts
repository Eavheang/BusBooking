import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],  // Include RouterModule here
  template: '<router-outlet></router-outlet>', // Add the router-outlet
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
