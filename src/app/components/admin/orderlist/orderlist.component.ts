import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { OrderService } from '../../../services/order.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { Router } from '@angular/router';



@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss']
})


export class OrderlistComponent implements OnInit {
  abrirModal = "#mymodal";
  //Clases Modal
  closeResult: string;
  //Clases Modal
  ordenes;
  errorDisplay = 'loading';
  sentOrders: any[];

  constructor(private http: HttpClient, private orderService: OrderService, private firestore: AngularFirestore, public router: Router, public location: Location, private modalService: NgbModal, config: NgbModalConfig) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit(): void {


    //this.sentOrders = this.firestore.collection('orders').valueChanges(); 

    this.orderService.getOrders().subscribe(orders => {
      this.sentOrders = orders;
      console.log(this.sentOrders);
    });




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
      console.log(this.ordenes);
      for (var i = 0; i < this.sentOrders.length; i++) {
        this.ordenes = this.ordenes.filter(order => {

          return order.orderNumber != this.sentOrders[i].orderNumber;
        });
      }
      console.log(this.ordenes);

    })


  }

  //Creates a job request using stuart api
  //Returns a JSON with the job created or an error when the job request fails
  //Generates a pop up when success or error. 
  createJob(order, mymodal) {
    //Codigo para abrir MODAL
    this.modalService.open(mymodal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });


    var respuesta;
    console.log('clicked');
    console.log(order);

    this.http.post<any>(`https://us-central1-squarespacestuart.cloudfunctions.net/getOrdenes`, order).subscribe({
      next: data => {
        respuesta = data;
        console.log(respuesta);
        //If JSON object hast error then print in console
        if (respuesta.error) {
          console.log('bigg error');//aqui cambio de variable para mostrar el modal.
          this.errorDisplay = 'error';
        }
        else {
          this.errorDisplay = 'success';
          this.orderService.createOrder(order);
          console.log(this.sentOrders);
          for (var i = 0; i < this.sentOrders.length; i++) {

            this.ordenes = this.ordenes.filter(order => {

              return order.orderNumber != this.sentOrders[i].orderNumber;
            });

          }
        }
      },
      error: error => console.error('There was an error!', error)
    })

  }


  trackOrder(index: number, order: any) {
    console.log(order);
    return order ? order.orderNumber : null;

  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  refresh(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([decodeURI(this.location.path())]);
    });



  }


}
