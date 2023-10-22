import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millisecondToMMSS',
  standalone: true
})
export class MillisecondToMMSSPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    const totalSeconds = Math.floor(value / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes} : ${seconds < 10 ? '0' + seconds :seconds}`
  }

}
