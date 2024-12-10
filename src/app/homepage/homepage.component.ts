import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule for routing
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'homepage',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule], // Add NgModel to the imports array
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  from: string = ''; // Departure location
  to: string = ''; // Destination location
  goDate: string = ''; // Departure date
  returnDate: string = ''; // Return date
  locations = ['Phnom Penh', 'Siem Reap', 'Kompot', 'Kep']; // Locations array for the dropdown

  constructor(private router: Router) {}

  onSubmit() {
    // Navigate to BusListComponent with query params
    this.router.navigate(['/bus-list'], {
      queryParams: {
        from: this.from,
        to: this.to,
        goDate: this.goDate,
        returnDate: this.returnDate, // Optionally pass the returnDate
      },
    });
  }
}
