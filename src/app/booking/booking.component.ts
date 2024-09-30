import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule for two-way binding
import { CommonModule } from '@angular/common'; // Import CommonModule for built-in Angular directives

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  ticketCount: number = 1; // Default ticket count
  pricePerTicket: number = 20; // Example price per ticket
  totalPrice: number = this.pricePerTicket;
  firstName: string = '';
  lastName: string = '';

  updateTotalPrice() {
    this.totalPrice = this.ticketCount * this.pricePerTicket;
  }
}
