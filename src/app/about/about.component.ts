import { Component, OnInit } from '@angular/core';
import { fromEvent, timer } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {

    // const interval$ = interval(1000); // every x ms
    // interval$.subscribe(val => console.log('stream 1 => ', val));
    // interval$.subscribe(val => console.log('stream 2 => ', val));

    const interval$ = timer(3000, 1000); // every 1000 ms with initial delay of 3000
    const sub = interval$.subscribe(val => console.log('stream 1 => ', val));

    setTimeout(() => sub.unsubscribe(), 5000); // unsubscribe from observable

    const click$ = fromEvent(document, 'click'); // click events on "document"
    const subscription = click$.subscribe(
      evt => console.log(evt),
      err => console.log(err), // either this or completed
      () => console.log('completed') // either this or error
    );

  }

}
