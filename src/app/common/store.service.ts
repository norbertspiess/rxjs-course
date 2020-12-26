import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course } from '../model/course';
import { createHttpObservable } from './util';
import { filter, map, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root',
})
export class Store {

  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$ = createHttpObservable('/api/courses');

    http$
      .pipe(
        tap(() => console.log('HTTP request executed')),
        map(res => Object.values(res['payload'])),
      )
      .subscribe(
        courses => this.subject.next(courses)
      );
  }

  selectBeginnerCourses() {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED');
  }

  private filterByCategory(category: string) {
    return this.courses$
      .pipe(
        map(courses => courses
          .filter(course => course.category === category))
      );
  }

  selectCourseById(courseId: number) {
    return this.filterById(courseId);
  }

  private filterById(courseId: number) {
    return this.courses$
      .pipe(
        map(courses => courses
          .find(course => course.id === courseId)),
        filter(course => !!course), // ignore "undefined" values
      );
  }

  saveCourse(courseId: number, changes: any): Observable<any> {
    const courses = this.subject.getValue();
    const courseIndex = courses
      .findIndex(course => course.id === courseId);
    const newCourses: Course[] = courses.slice(0);
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes,
    };
    this.subject.next(newCourses);

    return fromPromise(fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }
}
