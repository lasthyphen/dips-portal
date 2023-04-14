import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { DipsService } from '../../services/dips.service';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-dip-details',
  templateUrl: './dip-details.component.html',
  styleUrls: ['./dip-details.component.scss'],
})
export class DipDetailsComponent implements OnInit, OnChanges {
  @Input() status: string;
  @Input() dateProposed: string;
  @Input() dateRatified: string;
  @Input() ratifiedDataLink: string;
  @Input() dipName: string;
  @Input() title: string;
  @Input() authors: string[];
  @Input() contributors: string[];
  @Input() type: string;
  @Input() lastOpened: string;
  @Input() dependencies: string[];
  @Input() replaces: string;
  @Input() pollAddress: string;
  @Input() tags: string[];
  @Input() darkMode: boolean;

  deps = [];

  constructor(
    private statusService: StatusService,
    private dipsService: DipsService
  ) {}

  ngOnInit(): void {}

  getStatusValue(data: string): string {
    return this.statusService.getStatusValue(data);
  }

  getStatusType(data: string): string {
    return this.statusService.getStatusType(data);
  }

  isEmptyWhenReduce(array: string[]): boolean {
    let str: string;
    if (array && array.length > 0) {
      str = array.reduce((c, t) => {
        return (t as string).concat(c);
      });
    }

    return !str ? true : false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dependencies?.currentValue?.length) {
      const deps = this.dependencies;

      if (deps.length) {
        this.dipsService.checkDependencies(deps).subscribe((data) => {
          this.deps = deps.map((dep) => {
            const dipName = dep.split(' ').shift().replace('-', '');
            return ({
              exists: !!data.items.find((m) => m.dipName === dipName),
              link: `/dips/details/${dipName}`,
              dep,
            })
          });
        });
      } else {
        this.deps = [];
      }
    } else if (changes.dependencies?.currentValue) {
      this.deps = [];
    }
  }
}
