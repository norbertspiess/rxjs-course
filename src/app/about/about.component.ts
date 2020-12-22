import { Component, OnInit } from '@angular/core';
import { AsyncSubject } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {

    // const subject = new Subject<number>(); // basic subject has no "memory"
    // const subject = new BehaviorSubject<number>(0); // always emit last value. needs initializing value. except if completed
    const subject = new AsyncSubject<number>(); // waits until completion, before emitting the last value ONLY
    const series$ = subject.asObservable();

    series$.subscribe(val => console.log('early sub: ', val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    subject.complete();

    setTimeout(() => {
      series$.subscribe(val => console.log('late sub: ', val));
    }, 3000); // receives last emitted value as well
  }

}
