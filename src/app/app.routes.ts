import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { BusListComponent } from './bus-list/bus-list.component';
import { BookingComponent } from './booking/booking.component';
import { ReviewComponent } from './review/review.component';
import { AboutComponent } from './about-us/about-us.component';
export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'bus-list', component: BusListComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'review', component: ReviewComponent},
  { path: 'about', component: AboutComponent}
];
