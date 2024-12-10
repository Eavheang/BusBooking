import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  ticketCount: number = 1;
  pricePerTicket: number = 20;
  totalPrice: number = this.pricePerTicket;
  firstName: string = '';
  lastName: string = '';
  email: string = '';  
  origin: string = '';
  destination: string = '';
  travelDate: string = '';
  locations: string[] = ['Phnom Penh', 'Siem Reap', 'Kep', 'Kompot', 'Preah Sihanuk', 'Kirirom'];

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Capture the query parameters from the URL
    this.route.queryParams.subscribe(params => {
      this.origin = params['from'];
      this.destination = params['to'];
      this.travelDate = params['goDate'];
      this.updatePrice(); // Update the price when parameters are received
    });
  }

  updatePrice() {
    // Update price based on origin and destination
    if (this.origin === 'Phnom Penh' && this.destination === 'Siem Reap') {
      this.pricePerTicket = 14;
    } else if (this.origin === 'Phnom Penh' && this.destination === 'Kep') {
      this.pricePerTicket = 10;
    } else if (this.origin === 'Phnom Penh' && this.destination === 'Kompot') {
      this.pricePerTicket = 9;
    } else {
      this.pricePerTicket = 20; // Default price if no match is found
    }

    // Recalculate total price based on the updated pricePerTicket
    this.updateTotalPrice();
  }

  updateTotalPrice() {
    this.totalPrice = this.ticketCount * this.pricePerTicket;
  }

  confirmBooking() {
    if (!this.firstName || !this.lastName || !this.email || !this.origin || !this.destination || !this.travelDate) {
      alert('Please fill in all required fields.');
      return;
    }

    const bookingData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      origin: this.origin,
      destination: this.destination,
      travelDate: this.travelDate,
      ticketCount: this.ticketCount,
      totalPrice: this.totalPrice,
    };

    this.http.post('http://localhost:3000/api/confirmBooking', bookingData).subscribe(
      (response: any) => {
        alert(response.message || 'Booking confirmed successfully!');
        window.location.reload();
      },
      (error) => {
        console.error('Error:', error);
        alert('There was an error confirming your booking: ' + (error.error?.message || error.message || 'Unknown error'));
      }
    );
  }
}
