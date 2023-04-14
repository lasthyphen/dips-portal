import { Component, OnInit, Output, ViewChild, EventEmitter, Input, HostListener, ElementRef } from '@angular/core';
import { DipsService } from '../../services/dips.service';
import FilterData from './filter.data';
import { FilterItemService } from '../../../../services/filter-item/filter-item.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  statusCLass: string;
  typeCLass: 'type-selected' | 'type-none';
  statusInputText  = '';
  statusPlaceHolder = 'Select Status';
  statusOptionsShow = false;
  typeInputText  = 'Select type';
  typeOptionsShow = false;
  @Input() contentOptionsShow = false;
  @Output() send = new EventEmitter();
  filterData: FilterData;
  filterDataSaved: FilterData;
  posStatus: number;
  posType: number;
  inside = false;
  selecteds: number[];
  cantSelected = 0;

  @HostListener('document:click', ['$event'])
  clickout(event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      if (this.inside && this.contentOptionsShow) {
        this.inside = false;
      } else {
        this.contentOptionsShow = false;
      }
    }
  }

  constructor(
    private dipsService: DipsService,
    private eRef: ElementRef,
    private filterItemService: FilterItemService
  ) { }

  ngOnInit(): void {
    this.statusCLass = 'status-none';
    this.typeCLass = 'type-none';
  }

  // ----------- Funtion to load the filters
  showFilter(): void {
    this.contentOptionsShow = !this.contentOptionsShow;
    if (this.contentOptionsShow) {
      this.inside = true;
      this.filterDataSaved = this.dipsService.getFilter();
      // this.setTyepClassAndText(this.filterDataSaved.posType);
      this.selecteds = this.filterDataSaved.arrayStatus;
      this.cantSelected = this.selecteds.filter(a => a === 1).length;
      if (this.cantSelected === 1) {
        this.setStatusClassAndText(this.filterDataSaved.arrayStatus.findIndex(a => a === 1), true);
      } else {
        this.statusInputText = this.getText();
      }
    }
  }

  setStatusClassAndText(pos: number, add = false): void {
    this.posStatus = pos;
    this.inside = true;
    this.statusOptionsShow = false;
    switch (pos) {
      case 0: {
                if (this.selecteds[0] === 0)  {
                  this.selecteds[0] = 1;
                  this.cantSelected++;
                } else {
                  if (!add) {
                    this.selecteds[0] = 0;
                    this.cantSelected--;
                  }
                }
                break;
              }
      case 1: {
                if (this.selecteds[1] === 0)  {
                  this.selecteds[1] = 1;
                  this.cantSelected++;
                } else {
                  if (!add) {
                    this.selecteds[1] = 0;
                    this.cantSelected--;
                  }
                }
                break;
              }
      case 2: {
                if (this.selecteds[2] === 0)  {
                  this.selecteds[2] = 1;
                  this.cantSelected++;
                } else {
                  if (!add) {
                    this.selecteds[2] = 0;
                    this.cantSelected--;
                  }
                }
                break;
              }
      case 3: {
                if (this.selecteds[3] === 0)  {
                  this.selecteds[3] = 1;
                  this.cantSelected++;
                } else {
                  if (!add) {
                    this.selecteds[3] = 0;
                    this.cantSelected--;
                  }
                }
                break;
              }
      case 4: {
                if (this.selecteds[4] === 0)  {
                  this.selecteds[4] = 1;
                  this.cantSelected++;
                } else {
                  if (!add) {
                    this.selecteds[4] = 0;
                    this.cantSelected--;
                  }
                }
                break;
              }
      case 5: {
                if (this.selecteds[5] === 0)  {
                  this.selecteds[5] = 1;
                  this.cantSelected++;
                } else {
                  if (!add) {
                    this.selecteds[5] = 0;
                    this.cantSelected--;
                  }
                }
                break;
              }
      case 6: {
                this.deleteItemsFromFilterList();
                this.statusCLass = 'status-none';
                this.statusOptionsShow = false;
                this.selecteds = [0 , 0, 0, 0, 0, 0];
                this.statusInputText = this.getText();
                this.cantSelected = 0;
                break;
              }
      }
    this.statusCLass = this.cantSelected === 1 ? this.getClass() : 'status-none';
    this.statusInputText = this.getText();
  }

  setTyepClassAndText(pos: number): void {
    this.posType = pos;
    this.inside = true;
    switch (pos) {
      case 0: { this.typeCLass = 'type-selected'; this.typeInputText = 'PROPOSAL'; this.typeOptionsShow = false; break; }
      case 1: { this.typeCLass = 'type-selected'; this.typeInputText = 'SUB-PROPOSAL'; this.typeOptionsShow = false; break; }
      case 2: { this.typeCLass = 'type-none'; this.typeInputText = 'Select Type'; this.typeOptionsShow = false; break; }
    }
  }

  containerShowStatus(): void {
    this.contentOptionsShow = !this.contentOptionsShow;
  }

  reset(): void {
    this.deleteItemsFromFilterList();
    // this.setStatusClassAndText(4);
    this.setTyepClassAndText(2);
    this.typeInputText = 'NONE';
    this.statusInputText = '';
    this.posStatus = 6;
    this.posType = 2;
    this.selecteds = [0, 0, 0, 0, 0, 0];
    this.apply();
  }

  apply(): void {
    this.filterData = {
      status: this.statusInputText,
      type: this.typeInputText,
      posStatus: this.posStatus,
      posType: this.posType,
      arrayStatus: this.selecteds
    };
    this.dipsService.setFilter(this.filterData);
    this.setFiltersList();
    this.contentOptionsShow = false;
    this.send.emit();
  }

  getClass(): string {
    if (this.selecteds[0] === 1 ) { return 'status-accepted'; }
    if (this.selecteds[1] === 1 ) { return 'status-rejected'; }
    if (this.selecteds[2] === 1 ) { return 'status-archive'; }
    if (this.selecteds[3] === 1 ) { return 'status-rfc'; }
    if (this.selecteds[4] === 1 ) { return 'status-obsolete'; }
    if (this.selecteds[5] === 1 ) { return 'status-fs'; }
  }

  getText(): string {
    this.statusPlaceHolder = 'Select Status';
    if (this.cantSelected === 1) {
      if (this.selecteds[0] === 1 ) { return 'ACCEPTED'; }
      if (this.selecteds[1] === 1 ) { return 'REJECTED'; }
      if (this.selecteds[2] === 1 ) { return 'ARCHIVE'; }
      if (this.selecteds[3] === 1 ) { return 'RFC'; }
      if (this.selecteds[4] === 1 ) { return 'OBSOLETE'; }
      if (this.selecteds[5] === 1 ) { return 'FORMAL SUBMISSION'; }
    }
    if (this.cantSelected === 0) { return ''; }
    this.statusPlaceHolder = '';
    return '';
  }

  deleteItemsFromFilterList(): void {
    this.selecteds.forEach((item, index) => {
      if (item) {
        this.filterItemService.remove(index.toString());
      }
    });
  }

  setFiltersList(): void {
    let filterSaved = this.dipsService.getFilter();

    if (filterSaved.arrayStatus[0] === 1) {
      this.filterItemService.add({
        id: '0',
        text: 'accepted',
        value: '0',
        color: '#27AE60'
      });
    } else {
      this.filterItemService.remove('0');
    }
    if (filterSaved.arrayStatus[1] === 1) {
      this.filterItemService.add({
        id: '1',
        text: 'rejected',
        value: '1',
        color: '#EB5757'
      });
    } else {
      this.filterItemService.remove('1');
    }
    if (filterSaved.arrayStatus[2] === 1) {
      this.filterItemService.add({
        id: '2',
        text: 'archive',
        value: '2',
        color: '#748AA1'
      });
    } else {
      this.filterItemService.remove('2');
    }
    if (filterSaved.arrayStatus[3] === 1) {
      this.filterItemService.add({
        id: '3',
        text: 'rfc',
        value: '3',
        color: '#F2994A'
      });
    } else {
      this.filterItemService.remove('3');
    }
    if (filterSaved.arrayStatus[4] === 1) {
      this.filterItemService.add({
        id: '4',
        text: 'obsolete',
        value: '4',
        color: '#B5B12A'
      });
    } else {
      this.filterItemService.remove('4');
    }
    if (filterSaved.arrayStatus[5] === 1) {
      this.filterItemService.add({
        id: '5',
        text: 'formal submission',
        value: '5',
        color: '#78288C'
      });
    } else {
      this.filterItemService.remove('5');
    }
  }

}
