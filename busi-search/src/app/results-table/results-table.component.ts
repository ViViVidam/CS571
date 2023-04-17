import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TableItem } from '../search-form/tableItem';


@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css']
})



export class ResultsTableComponent implements OnInit {
  @Output() isOpen = new EventEmitter<number>();

  display_function(index: number) {
    console.log("emit");
    this.isOpen.emit(index);

  }

  constructor() { }

  ngOnInit(): void {
  }

  @Input () Business: Array<TableItem> = []; //TableItem[];

}
