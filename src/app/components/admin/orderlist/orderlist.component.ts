import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss']
})
export class OrderlistComponent implements OnInit {
  ordenes;
  errorDisplay = true;
  constructor(private http: HttpClient, private orderService:OrderService) { }


  ngOnInit(): void {
    const headers = {
      'Authorization': 'Bearer 007ee585-3b3e-450e-8aa2-c9631ee7b86e',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0',
      'Content-Type': 'application/json'
    }


    const options = {
      withCredentials: false,
    }

    this.http.get<any>(`https://us-central1-squarespacestuart.cloudfunctions.net/getOrdenes`).subscribe(data => {
      this.ordenes = JSON.parse(data.body);
      console.log(this.ordenes.result);
      this.ordenes = this.ordenes.result;
      this.ordenes = this.ordenes.filter(order => {
        return order.fulfillmentStatus === 'PENDING'
      });
    })


  }

//Creates a job request using stuart api
//Returns a JSON with the job created or an error when the job request fails
//Generates a pop up when success or error. 
  createJob(order) {
    var respuesta;
    console.log('clicked');
    console.log(order);
    this.http.post<any>(`https://us-central1-squarespacestuart.cloudfunctions.net/getOrdenes`, order).subscribe({
      next: data => { 
        respuesta = data; 
        console.log(respuesta);
        //If JSON object hast error then print in console
        if(respuesta.error){
          console.log('bigg error');//aqui cambio de variable para mostrar el modal.
        }
        else{
          this.orderService.createOrder(order);
        }
      
      },
      error: error => console.error('There was an error!', error)
  })

  }


}
