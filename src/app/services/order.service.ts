import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private fireStore: AngularFirestore) { }

  getOrders() {
    return this.fireStore.collection('orders').snapshotChanges();
  }

  createOrder(order:any) {
    return this.fireStore.collection('orders').add(order);
  }

}


