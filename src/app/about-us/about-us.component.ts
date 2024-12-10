import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutComponent {
  title = 'Bus Booking Service';
  description = 'Your Trusted Travel Companion';
  mission = 'To provide safe, comfortable, and affordable transportation for our valued customers.';
  contactTitle = 'Contact Us';
  contactEmail = 'support@busbooking.com';
  contactPhone = '+855 123 456 789';
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}
  navigateToHome() {
    this.router.navigate(['/']);
  }
  navigateToReview() {
    this.router.navigate(['/review']);
  }
  navigateToAbout() {
    this.router.navigate(['/about']);
  }
}