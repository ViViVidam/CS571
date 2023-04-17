import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { TableItem } from '../search-form/tableItem';
import { Categories } from '../search-form/Categories';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReviewComponent} from '../details-card/ReviewComponent';
import { Marker } from '../details-card/Marker';
import { MapOptions } from '../details-card/MapOptions';
import { FormControl, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Reservation } from '../details-card/Reservation';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-details-card',
  templateUrl: './details-card.component.html',
  styleUrls: ['./details-card.component.css'],
  providers:[DatePipe]
})
export class DetailsCardComponent implements OnInit {
  myDate = new Date();
  @Input () BusinessItem: TableItem | undefined;
  @ViewChild("bookingForm") myNameElem: ElementRef | undefined;
  @ViewChild('closebutton') childModal: ElementRef | undefined;

  marker:Marker | undefined;
  mapOptions: MapOptions | undefined;
  myDateMin: any;
  isSubmitted = false;
  photos: string[]=[];
  review: ReviewComponent[] | undefined;

  @Output() goback = new EventEmitter<number>();

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.myDateMin = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    //console.log(this.BusinessItem);
    if(!this.BusinessItem)
      return;
    this.marker = new Marker(Number(this.BusinessItem.coordinates.latitude),Number(this.BusinessItem.coordinates.longitude));
    this.mapOptions = new MapOptions(this.marker, 18);
    // this.marker.lat = Number(this.BusinessItem.coordinates.latitude);
    // this.marker.lng = Number(this.BusinessItem.coordinates.longitude);




    var params = new HttpParams().set('id', this.BusinessItem.id);
    var url = 'https://businesssearch-363201.uw.r.appspot.com/card';
    this.http.get<string[]>(url, { params: params})
    .subscribe(
     (data:string[]) => {this.photos=data;}
    );

    var review_url = 'https://businesssearch-363201.uw.r.appspot.com/review';
    this.http.get<ReviewComponent[]>(review_url, { params: params})
    .subscribe(
     (data:ReviewComponent[]) => {this.review =data;}
    );


  }

  goBack() {
      this.goback.emit(11);
  }

  submitReservation(f:NgForm) {
    if(!this.myNameElem) return;
    console.log(f.controls['date']);
    this.isSubmitted = true;
    if(f.valid==false)
      return;
    console.log(f.controls['email'].valid);
    if (!this.BusinessItem)
      return;
    var reservation = new Reservation(this.BusinessItem.name,f.value.date,f.value.hour,f.value.minute,f.value.email);
    localStorage.setItem(this.BusinessItem.id, JSON.stringify(reservation));
    console.log(JSON.stringify(reservation));
    alert("Reservation created!");
    console.log(this.childModal);
    if(this.childModal)
    {

      this.childModal.nativeElement.click();

    }



  }

  getErrors(f:NgForm,key:string){
    console.log(111);
    if(f.controls['key']){
      console.log(222);
      return f.controls['key'].invalid;
    }
    else
      return false;
  }

  haskey(key:string):boolean{
    if(localStorage.getItem(key) === null){
      return false;
    }
    else return true;
  }

  deleteBooking(key:string){
    localStorage.removeItem(key);
    alert("Reservation cancelled!");
  }

  closeModal(f:NgForm){
    this.isSubmitted = false;
    f.reset();
  }

  getCategory(data:Categories[]){
  var str = "";
  for(var i=0;i<data.length;i++){
      str += data[i].title;
      if(i<data.length-1)
        str += ' | ';
  }
  return str;
}



}
