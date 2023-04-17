import { Component, ViewChild, ElementRef, OnInit  } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'busi-search';
  @ViewChild('searchbutton') childModal: ElementRef | undefined;
  @ViewChild('test') childModal2: ElementRef | undefined;
  ngOnInit(){
    console.log(2222);
    if(this.childModal)
    {
      console.log(1111);
      this.childModal.nativeElement.click();

    }
    console.log(this.childModal2);
  }
}
