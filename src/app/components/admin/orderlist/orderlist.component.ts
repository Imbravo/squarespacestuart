import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss']
})
export class OrderlistComponent implements OnInit {
  ordenes;

  constructor( private http: HttpClient) { }


  ngOnInit(): void {
    const headers = { 'Authorization': 'Bearer 007ee585-3b3e-450e-8aa2-c9631ee7b86e', 
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
    })


  }

}
