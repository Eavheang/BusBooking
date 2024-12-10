import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { BusListComponent } from './bus-list/bus-list.component';
import { BookingComponent } from './booking/booking.component';

export const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'bus-list', component: BusListComponent },
  { path: 'booking', component: BookingComponent },
];
