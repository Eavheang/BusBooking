import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Review {
  _id?: string; // Optional ID for backend use
  name: string;
  review: string;
  rating: number;
}

@Component({
  selector: 'app-review',
  standalone: true, // Declare this as a standalone component
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent implements OnInit {
  reviews: Review[] = [];
  showForm: boolean = false;
  currentReview: Review = { name: '', review: '', rating: 1 };
  editing: boolean = false;
  editIndex: number = -1;

  constructor(private http: HttpClient, private router: Router) {}

  // Fetch reviews from the backend
  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews() {
    this.http.get<Review[]>('http://localhost:3000/api/reviews').subscribe(
      (response) => {
        this.reviews = response;
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }
  navigateToReview() {
    this.router.navigate(['/review']);
  }
  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  openReviewForm() {
    this.showForm = true;
    this.editing = false;
    this.currentReview = { name: '', review: '', rating: 1 };
  }

  closeReviewForm() {
    this.showForm = false;
  }
  saveReview() {
    if (this.editing) {
      // Update review
      this.http.put<Review>(`http://localhost:3000/api/reviews/${this.currentReview._id}`, this.currentReview).subscribe(
        () => {
          this.fetchReviews(); // Refetch reviews after update
          this.closeReviewForm();
        },
        (error) => {
          console.error('Error updating review:', error);
        }
      );
    } else {
      // Add new review
      this.http.post<Review>('http://localhost:3000/api/reviews', this.currentReview).subscribe(
        () => {
          this.fetchReviews(); // Refetch reviews after adding
          this.closeReviewForm();
        },
        (error) => {
          console.error('Error adding review:', error);
        }
      );
    }
  }
  
  deleteReview(review: Review) {
    this.http.delete(`http://localhost:3000/api/reviews/${review._id}`).subscribe(
      () => {
        this.fetchReviews(); // Refetch reviews after deletion
      },
      (error) => {
        console.error('Error deleting review:', error);
      }
    );
  }

  editReview(review: Review) {
    this.currentReview = { ...review };
    this.editIndex = this.reviews.indexOf(review);
    this.editing = true;
    this.showForm = true;
  }

}
