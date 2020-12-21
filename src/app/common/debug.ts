import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { env } from 'process';

export enum RxJsLoggingLevel {
  TRACE, DEBUG, INFO, ERROR
}

const loggingLevel = env.logLevel ? env.logLevel : RxJsLoggingLevel.INFO;

export function debug(level: RxJsLoggingLevel, message: string) {
  return (source: Observable<any>): Observable<any> => source
    .pipe(
      tap(val => {
        if (level >= loggingLevel) {
          console.log(message, ': ', val);
        }
      })
    );
}
