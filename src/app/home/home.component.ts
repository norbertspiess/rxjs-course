import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { noop } from 'rxjs';
import { map } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private beginnersCourses: Course[];
  private advancedCourses: Course[];

  constructor() {

  }

  ngOnInit() {

    const http$ = createHttpObservable('/api/courses');

    const courses$ = http$
      .pipe(
        map(res => Object.values(res['payload']))
      );

    courses$.subscribe(
      courses => {
        this.beginnersCourses = courses.filter(c => c.category == 'BEGINNER');
        this.advancedCourses = courses.filter(c => c.category == 'ADVANCED');
      },
      noop, // no operation
      () => console.log('done')
    );

  }

}
