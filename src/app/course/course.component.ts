import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { concat, fromEvent, Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, RxJsLoggingLevel } from '../common/debug';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  courseId: string;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
      .pipe(
        debug(RxJsLoggingLevel.INFO, 'course value')
      );
  }

  ngAfterViewInit() {
    const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith(''), // initial execution / item. in this case: search term
        debug(RxJsLoggingLevel.TRACE, 'search'),
        debounceTime(400), // only act if nothing changed for 400ms
        distinctUntilChanged(), // remove duplicate values
        switchMap(search => this.loadLessons(search)), // unsubscribe previous item$ and switch to new one, if previous is still running
        // throttle(() => timer(500)), // emit only first within 500ms
        // throttleTime(500), // alias for throttle
        debug(RxJsLoggingLevel.DEBUG, 'lessons value'),
      );

    const initialLessons$ = this.loadLessons();
    this.lessons$ = concat(initialLessons$, searchLessons$); // combine initial with following item$ to assign both to the member$
  }

  private loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map(res => res['payload'])
      );
  }

}
