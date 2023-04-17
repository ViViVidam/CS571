import { Component, OnInit } from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import { Reservation } from '../details-card/Reservation';


import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  // constructor() { }



  ngOnInit() {

  }
  getkey(id:string):Reservation{

    return JSON.parse(localStorage[id]);
  }
  localStorageKeys():string[]{
    return Object.keys(localStorage);
  }
  getLocalLength(){
    return localStorage.length;
  }

  delete(key:string) {
    localStorage.removeItem(key);
    alert("Reservation cancelled!");
  }


}
