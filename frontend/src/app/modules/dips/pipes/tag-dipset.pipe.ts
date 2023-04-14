import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagDipset',
})
export class TagDipsetPipe implements PipeTransform {
  transform(value: string): string {
    let newValue: string = '';
    if (value.endsWith('-dipset')) {
      newValue = value.split('-').slice(0, -1).join(' ');
      return newValue;
    }
    return null;
  }
}
