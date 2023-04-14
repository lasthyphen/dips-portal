import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { DipsService } from '../../services/dips.service';

@Component({
  selector: 'app-dips-pagination',
  templateUrl: './dips-pagination.component.html',
  styleUrls: ['./dips-pagination.component.scss'],
})
export class DipsPaginationComponent implements OnInit, OnChanges {
  @Input() dipPosition = 1;
  @Input() total: number;
  @Output() send = new EventEmitter<number>();
  timeout: any = null;
  @Input() dipName: string;
  @Input() parent: string;
  @Input() sections: any;
  @Input() dip: any;
  @Input() darkMode: boolean;
  breadcrumbList: BreadcrumbItem[] = [];

  constructor(private dipsService: DipsService, private router: Router) {}

  ngOnInit(): void {
    this.dipPosition = this.dipPosition !== undefined ? this.dipPosition : 0;
  }

  ngOnChanges() {
    this.breadcrumbList = [];
    if (this.parent) {
      this.breadcrumbList.push({ id: this.parent, name: this.parent });
    }

    this.breadcrumbList.push({ id: this.dipName, name: this.dipName });
  }

  loadDipsData(): void {
    if (this.dipPosition < this.total - 1) {
      // this.dipsService.updateActiveSearch(true);
      this.dipPosition++;
      this.send.emit(this.dipPosition);
    }
  }

  minus(): void {
    if (this.dipPosition > 0) {
      this.dipPosition--;
      this.send.emit(this.dipPosition);
    }
  }

  clearFilterAndGoHome(): void {
    this.dipsService.clearFilter();
    this.router.navigateByUrl('/dips/list');
  }

  isLastItem(index: number): boolean {
    return index + 1 === this.breadcrumbList.length;
  }
}

interface BreadcrumbItem {
  id: string;
  name: string;
}
