import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bus-list',
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.css'],
})
export class BusListComponent implements OnInit {
  from: string = '';
  to: string = '';
  goDate: string = '';
  busTimes: string[] = ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  constructor(private route: ActivatedRoute, private router: Router) {}
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
    // Get the query parameters
    this.route.queryParams.subscribe((params) => {
      this.from = params['from'];
      this.to = params['to'];
      this.goDate = params['goDate'];
    });
  }

  // Navigate to the /booking route when "Book Now" is clicked
  bookNow() {
    this.router.navigate(['/booking'], {
      queryParams: {
        from: this.from,
        to: this.to,
        goDate: this.goDate
      }
    });
  }
  

  goHome() {
    this.router.navigate(['/']); // Navigate to the homepage
  }
}
