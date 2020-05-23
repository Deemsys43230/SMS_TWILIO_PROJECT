import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-pagination-util',
  templateUrl: './pagination-util.component.html',
  styleUrls: ['./pagination-util.component.scss']
})
export class PaginationUtilComponent implements OnInit {

  @Input() pageNo: String;
  @Input() itemsPerPage: String;
  @Input() totalRecords: String;
  @Output() goToPage = new EventEmitter<Number>();
  @Output() getItemPerPage= new EventEmitter<String>();
  @Output() getPageNo=new EventEmitter<String>();
  public math=Math;

  constructor() { }

  ngOnInit() {
  }

  goToPageAction(toPage: any){
    if(toPage>0){
      this.goToPage.emit(toPage);
    }
  }

  changeItemsPerPage(itemsPerPage: any){
    this.getItemPerPage.emit(itemsPerPage);
  }

  setPageNo(pageNo: any){
    if(pageNo>0)
      this.getPageNo.emit(pageNo);
  }

}
