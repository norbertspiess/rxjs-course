import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  public series$: Observable<number>;

  ngOnInit() {

    const subject = new Subject<number>(); // keep this one private
    this.series$ = subject.asObservable(); // this can be public

    this.series$.subscribe(console.log);

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.complete();

    // simple way to create observables, BUT
    // - no unsubscription logic
    // - subjects can be misused

  }

}






