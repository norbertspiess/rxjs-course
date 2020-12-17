import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnersCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  ngOnInit() {

    const http$: Observable<Response> = createHttpObservable('/api/courses');

    const courses$: Observable<Course[]> = http$
      .pipe(
        tap(() => console.log('HTTP request executed')),
        map(res => Object.values(res['payload'] as Course[])),
        shareReplay(), // do not execute with every subscription

        // catchError(err => of([])) // recovery

        // catchError(err => { // catch and rethrow
        //   console.log('Error occurred', err);
        //   return throwError(err); // immediately erroring out observable
        // }), // catch and rethrow with custom logging
        // // depending on where catch&finalize are put in the operator chain, they are affecting other parts
        // finalize(() => console.log('Finalize executed'))

        // retryWhen(errors => {
        //   // return errors; // immediately try again
        //   return errors.pipe(
        //     delayWhen(() => timer(2000)) // wait for 2 sec on each error
        //   );
        // })
      );

    this.beginnersCourses$ = courses$
      .pipe(
        map(courses => courses.filter(_ => _.category === 'BEGINNER'))
      );

    this.advancedCourses$ = courses$
      .pipe(
        map(courses => courses.filter(_ => _.category === 'ADVANCED'))
      );

  }

}
