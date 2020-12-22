import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {

    const subject = new Subject<number>(); // basic subject has no "memory"
    const series$ = subject.asObservable();

    series$.subscribe(val => console.log('early sub: ', val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    // subject.complete();

    setTimeout(() => {
      series$.subscribe(val => console.log('late sub: ', val)); // nothing happens here, as items are already emitted

      subject.next(4); // is picked up by both
    }, 3000);
  }

}






