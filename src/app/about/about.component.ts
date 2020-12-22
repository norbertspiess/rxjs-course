import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {

    // const subject = new Subject<number>(); // basic subject has no "memory"
    const subject = new BehaviorSubject<number>(0); // always emit last value. needs initializing value
    const series$ = subject.asObservable();

    series$.subscribe(val => console.log('early sub: ', val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    // subject.complete(); // if completed before late subscription, late subscription does not get any value

    setTimeout(() => {
      series$.subscribe(val => console.log('late sub: ', val)); // 3, as it's the last emitted value
    }, 3000);
  }

}
