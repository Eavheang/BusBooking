import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  mapUrl: SafeResourceUrl | null = null;
  destinationMaps: { [key: string]: string } = {
    'Phnom Penh': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.8252897450774!2d104.92373367588542!3d11.556222644043006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513dc76a6be3%3A0x9c02ee4a5b4ae7a!2sPhnom%20Penh!5e0!3m2!1sen!2skh!4v1702268945258!5m2!1sen!2skh',
    'Siem Reap': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62386.51695958937!2d103.84614953193215!3d13.364294699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310369ad46ea09ad%3A0xcb44e9ed33b1382a!2sSiem%20Reap!5e0!3m2!1sen!2skh!4v1702268993589!5m2!1sen!2skh',
    'Kep': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31407.26011634693!2d104.27067900593743!3d10.486660041966657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310055cc9c3a4379%3A0x4f6012dca80fac!2sKep%2C%20Cambodia!5e0!3m2!1sen!2skh!4v1702269025545!5m2!1sen!2skh',
    'Kompot': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31410.88886458472!2d104.07575984961913!3d10.683146383884692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31012f9d704faf5f%3A0xd9fdf89ca26f6f!2sKompot%2C%20Cambodia!5e0!3m2!1sen!2skh!4v1702269054560!5m2!1sen!2skh',
    'Preah Sihanuk': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31428.704901106002!2d104.84568180458328!3d10.608536405307224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310010e0f28b1185%3A0x4056440d55485461!2sSihanoukville%2C%20Cambodia!5e0!3m2!1sen!2skh!4v1702269081291!5m2!1sen!2skh',
    'Kirirom': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31363.42052123713!2d104.11937670015626!3d11.250023393992241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3108e8669f0a1037%3A0xbc4a534f07b77a62!2sKirirom%20National%20Park!5e0!3m2!1sen!2skh!4v1702269108908!5m2!1sen!2skh'
  };

    constructor(
    private http: HttpClient, 
    private router: Router, 
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}
  navigateToHome() {
    this.router.navigate(['/']);
  }
  navigateToReview() {
    this.router.navigate(['/review']);
  }
  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  ngOnInit(): void {
    // Capture the query parameters from the URL
    this.route.queryParams.subscribe(params => {
      this.origin = params['from'];
      this.destination = params['to'];
      this.travelDate = params['goDate'];
      this.updatePrice(); // Update the price when parameters are received
      if (this.destination && this.destinationMaps[this.destination]) {
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          this.destinationMaps[this.destination]
        );
      }
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

    this.http.post('/api/confirmBooking', bookingData).subscribe(
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
