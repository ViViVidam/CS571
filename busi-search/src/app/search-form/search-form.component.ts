import { Component, OnInit, Injectable, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormClass } from './formClass';
import { TableItem } from './tableItem';
import { Suggestion } from './suggestion';
import { Ipinfo } from './ipinfo';
import {Coordinates} from './Coordinates'


import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';

@Injectable ({
  providedIn: 'root'
})

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})

export class SearchFormComponent implements OnInit {
  keyWordCtrl = new FormControl();
  selectCtrl = new FormControl();
  filteredOptions: any;
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 1;
  buttonState = false;

@ViewChild("testing") myNameElem: ElementRef | undefined;
@ViewChild("locInput") locInput: ElementRef | undefined;
  display_control = false;

  click_index = -1;


  // selectedKeyword: any = "";

  options: Array<string> = [];

  nrSelect = "Default";
  nrInput = "10";
  Businesses: Array<TableItem> = [];
  port = '${process.env.API_BASE_URL}';
  private url = 'https://businesssearch-363201.uw.r.appspot.com/getTable';
  //private url = 'http://localhost:8080/getTable';
  constructor (private http: HttpClient) {}

  ngOnInit(): void {
    this.selectCtrl.setValue("all");
    this.keyWordCtrl.valueChanges.pipe(filter(res => {
      return res !== null && res.length >=this.minLengthTerm
    }),
    distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.options = [];
          this.isLoading = true;
          console.log(this.isLoading);
        }),
        switchMap(value => this.http.get<Suggestion[]>('https://businesssearch-363201.uw.r.appspot.com/autoComplete?key='+value)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe((data: Suggestion[]) => { //console.log(data);
        if (data == undefined) {
          this.errorMsg = data['Error'];
          this.options = [];
        } else {
          this.errorMsg = "";
          this.options = data.map((item)=>item["text"]);
          console.log(this.options);
        }
        //console.log(data);
      });


  }

  onclick_result(a:number) {

      this.click_index = a;

  }

  disableLoc(f:NgForm){
    if(!this.locInput)
      return;
    this.locInput.nativeElement.disabled = !f.value.autoLoc;
    f['controls']['loc'].reset();
    //this.locInput.nativeElement.disable() = f.value.checkbox;
  }

  getLoc():Observable<Ipinfo>{
    let lat = 0;
    let lng = 0;
    console.log(5555555555);
    return this.http.get<Ipinfo>("https://ipinfo.io/json?token=e7a797d54c1bba");
  }

  onSubmitTemplateBased(f:NgForm) {
    if(!this.myNameElem) return;
    // console.log(this.selectCtrl.value);
    // console.log(f.value);
    if(!this.myNameElem.nativeElement.reportValidity())
      return;
    var lng = 0;
    var lat = 0;
    console.log(2322223323);
    if(f.value.autoLoc){
      this.getLoc().subscribe(
        (data:Ipinfo) => {
          var arr = data.loc.split(",")
          lat = Number(arr[0]);
          lng = Number(arr[1]);
          let params = new HttpParams().set('key', this.keyWordCtrl.value)
          .set('dist', f.value.dist)
          .set('cat', this.selectCtrl.value)
          .set('loc', f.value.loc)
          .set('autoLoc', f.value.autoLoc)
          .set('lat', lat)
          .set('lng', lng);
          console.log(params);
          this.http.get<TableItem[]>(this.url, { params: params})
          .subscribe(
            (data:TableItem[]) => {console.log(111);this.Businesses = data; if(data.length>0) this.click_index = 11;}
            // `id: ${data.id} alias: ${data.alias}`
          );
        });
    }
    else{
      let params = new HttpParams().set('key', this.keyWordCtrl.value)
      .set('dist', f.value.dist)
      .set('cat', this.selectCtrl.value)
      .set('loc', f.value.loc)
      .set('autoLoc', f.value.autoLoc)
      .set('lat', lat)
      .set('lng', lng);
      console.log(params);
      this.http.get<TableItem[]>(this.url, { params: params})
      .subscribe(
        (data:TableItem[]) => {console.log(111);this.Businesses = data; if(data.length>0) this.click_index = 11;}
        // `id: ${data.id} alias: ${data.alias}`
      );
    }
 }

 reset_function(f:NgForm){
   this.click_index = -1;
   this.keyWordCtrl.reset();
   this.selectCtrl.reset();
   this.selectCtrl.setValue("all");
   if(this.locInput)
   this.locInput.nativeElement.disabled = false;

   f.resetForm( {'dist':10});


 }
}
