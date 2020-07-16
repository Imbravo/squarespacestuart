import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orders: Observable<any[]>;
  constructor(private fireStore: AngularFirestore) { 
    this.orders = this.fireStore.collection('orders').valueChanges();
  }

  getOrders() {
    return this.orders;
  }

  createOrder(order:any) {
    return this.fireStore.collection('orders').add(order);
  }

}


