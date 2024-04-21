import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from '../../services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderhistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) {}

  ngOnInit(): void {
    this.handlerOrderHistory();
  }
  
  handlerOrderHistory() {

    //read the users email form browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    //retrieve data from the service
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data =>{
        this.orderhistoryList = data._embedded.orders;

    })
  }

}
