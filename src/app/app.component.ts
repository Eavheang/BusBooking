import { Component } from '@angular/core';
import { BookingComponent } from './booking/booking.component'; // Import the standalone BookingComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BookingComponent], // Include BookingComponent directly
  template: '<app-booking></app-booking>', // Use the BookingComponent in the template
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
