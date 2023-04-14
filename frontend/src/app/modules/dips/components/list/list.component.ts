import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  OnChanges,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { DipsService } from '../../services/dips.service';
import { map } from 'rxjs/operators';
import { IDip } from '../../types/dip';
import { OrderService } from '../../services/order.service';
import {
  Order,
  OrderDirection,
  OrderField,
  OrderFieldName,
} from '../../types/order';
import { SearchService } from '../../services/search.service';
import { FilterService } from '../../services/filter.service';
import { Subscription } from 'rxjs';
import { StatusService } from '../../services/status.service';
import { ISubsetDataElement } from '../../types/subset';
import { ComponentDip } from '../../types/component-dip';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from 'src/app/services/lang/lang.service';

const clone = require('rfdc')();

interface ExpandedItems {
  subproposals: boolean;
  summary: boolean;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
    trigger('subproposalExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', overflow: 'hidden' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('525ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ListComponent implements OnInit, OnChanges, OnDestroy {
  columnsToDisplay = ['pos', 'title', 'summary', 'status', 'links'];
  @Input() dataSource: any;
  @Input() loading = true;
  @Input() moreToLoad = true;
  @Input() paginationTotal;
  @Input() hideParent;

  filter: any;
  search: string;
  expandedElement: DataElement | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selected = '-1';
  @Input() paginatorLength;
  pageEvent: PageEvent;
  @Output() send = new EventEmitter();
  @Output() sendOrder = new EventEmitter<{
    orderText: string;
    orderObj: Order;
  }>();
  timeout: any = null;
  currentSortingColumn: string = '';
  ascOrderSorting: boolean = true;
  sortClicked: boolean = false;
  arrowUp: string = './assets/images/up.svg';
  arrowDown: string = './assets/images/down.svg';
  arrowUpDark: string = './assets/images/up_dark.svg';
  arrowDownDark: string = './assets/images/down_dark.svg';
  isArrowDownOnMouseOver: boolean = false;
  currentRowOver: any;
  dataSourceTable = new MatTableDataSource<any>();
  _expandedItems: ExpandedItems = {
    subproposals: true,
    summary: false,
  };

  get expandedItems() {
    return this._expandedItems;
  }

  set expandedItems(value) {
    this._expandedItems = { ...value };
  }

  subproposalsGroup: any;
  columnsToDisplaySubsetChildren = ['title', 'summary', 'status', 'link'];
  expandedElementSubsetChildren: DataElement | null;
  subscriptionSearchService: Subscription;
  subscriptionFilterService: Subscription;
  @Input() showHead: boolean = true;
  @Input() query: string;
  @Input() darkMode = false;
  @Input() statusParameters;
  markdown = `## Markdown __rulez__!
---

### Syntax highlight
\`\`\`typescript
const language = 'typescript';
\`\`\`

### Lists
1. Ordered list
2. Another bullet point
  - Unordered list
  - Another unordered bullet point

### Blockquote
> Blockquote to the max`;

  constructor(
    private router: Router,
    private dipsService: DipsService,
    private cdr: ChangeDetectorRef,
    private orderService: OrderService,
    private searchService: SearchService,
    private filterService: FilterService,
    private statusService: StatusService,
    private translate: TranslateService,
    private langService: LangService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.dataSourceTable.data = this.dataSource;

    this.langService.currentLang$.subscribe((language: string) => {
      this.translate.use(language);
    });

    this.currentSortingColumn =
      this.orderService.order.field == OrderFieldName[OrderFieldName.Number]
        ? 'pos'
        : (OrderFieldName[
            this.orderService.order.field
          ] as string)?.toLowerCase();
    this.ascOrderSorting = this.orderService.order.direction == 'ASC';
    this.subscriptionSearchService = this.searchService.search$.subscribe(
      (data) => {
        this.search = data;
      }
    );
    this.subscriptionFilterService = this.filterService.filter$.subscribe(
      (data) => {
        this.filter = data;
      }
    );
  }

  ngOnChanges() {
    this.dataSourceTable.data = this.dataSource;
  }

  getStatusValue(data: string): string {
    return this.statusService.getStatusValue(data);
  }

  getStatusType(data: string): string {
    return this.statusService.getStatusType(data);
  }

  updateSelected(index: string, event: Event): void {
    event.stopPropagation();

    if (this.selected === index) {
      this.selected = '-1';
    } else {
      this.selected = index;
    }
  }

  // handlePageEvent(event: PageEvent): void {
  //   clearTimeout(this.timeout);
  //   const $this = this;
  //   this.timeout = setTimeout(() => {
  //       $this.send.emit(event.pageIndex);
  //   }, 1000);
  // }

  onSendOrder(value: string): void {
    let orderPrefix = OrderDirection.ASC;

    if (this.ascOrderSorting === true || this.currentSortingColumn !== value) {
      if (this.currentSortingColumn === value) {
        this.ascOrderSorting = !this.ascOrderSorting;
        orderPrefix = this.ascOrderSorting
          ? OrderDirection.ASC
          : OrderDirection.DESC;
      } else {
        this.ascOrderSorting = true;
        this.currentSortingColumn = value;
      }

      let order: Order = {
        field:
          this.currentSortingColumn == 'pos'
            ? 'Number'
            : this.toOrderBy(this.currentSortingColumn),
        direction: this.ascOrderSorting ? 'ASC' : 'DESC',
      };

      this.orderService.order = order;
      this.sendOrder.emit({
        orderText: orderPrefix + this.transforValue(value),
        orderObj: order,
      });
    } else {
      this.currentSortingColumn = '';
      this.ascOrderSorting = true;

      let order: Order = {
        field: 'Number',
        direction: 'ASC',
      };

      this.orderService.order = order;
      this.sendOrder.emit({
        orderText: 'dip dipName',
        orderObj: order,
      });
    }
  }

  getOrderDirection(column: string) {
    let orderDirection =
      this.currentSortingColumn === column && this.ascOrderSorting
        ? 1
        : this.currentSortingColumn === column && !this.ascOrderSorting
        ? -1
        : 0;

    return orderDirection;
  }

  transforValue(value: string): string {
    if (value === 'pos') {
      return 'dip';
    }
    if (value === 'title') {
      return 'title';
    }
    if (value === 'summary') {
      return 'sentenceSummary';
    }
    if (value === 'status') {
      return 'status';
    }
  }

  toOrderBy(value: string): string {
    let orderBy: string;

    switch (value) {
      case 'pos':
        orderBy = OrderFieldName.Number;
        break;
      case 'title':
        orderBy = OrderFieldName.Title;
        break;
      case 'summary':
        orderBy = OrderFieldName.Summary;
        break;
      case 'status':
        orderBy = OrderFieldName.Status;
        break;
      case 'mostUsed':
        orderBy = OrderFieldName.MostUsed;
        break;

      default:
        break;
    }

    return orderBy;
  }

  onScroll(): void {
    if (!this.loading && this.moreToLoad) {
      this.send.emit();
    }
  }

  onNavigateToDetails(name) {
    this.router.navigate(['/dips/details/', name]);
  }

  onMouseOverLeaveArrow(id: any, value: boolean) {
    this.isArrowDownOnMouseOver = value;
    this.currentRowOver = id;
  }

  onGetSubproposals(row: IDip, e: Event) {
    e.stopPropagation();
    if (row.expanded) {
      row.expanded = false;
    } else {
      let index = this.dataSourceTable.data.findIndex(
        (item) => item._id === row._id
      );
      // show subproposals children
      if (index !== -1) {
        this.dataSourceTable.data[index]['loadingSubproposals'] = true;
        let filter = clone(this.filter);
        filter['equals'] = [];
        filter.equals.push({ field: 'proposal', value: row.dipName });
        filter.search = '';
        // TODO:Choose what criteria of filter do we want?
        filter.contains = filter.contains || [];
        filter.contains.push({ field: 'dipName', value: row.dipName });
        filter.notequals = [];
        let order: string;
        if (
          this.orderService.order.field &&
          this.orderService.order.direction
        ) {
          order =
            OrderDirection[this.orderService.order.direction] +
            OrderField[this.orderService.order.field];
        } else {
          order = 'dipName';
        }

        console.log({ order });
        this.dipsService
          .searchDips(
            100000,
            0,
            order + ' dipCodeNumber',
            row.showArrowExpandChildren
              ? this.query
                ? this.query
                : this.search
              : '',
            filter,
            'title proposal dipName filename paragraphSummary sentenceSummary dip status forumLink votingPortalLink dipCodeNumber'
          )
          .pipe(
            map((res) => {
              const newItems: any[] = (res.items as [])
                .filter((i: any) => i.dipName)
                .map(this.addSubsetField);
              res.items = newItems;
              return res;
            })
          )
          .subscribe(
            (data) => {
              this.dataSourceTable.data[index]['loadingSubproposals'] = false;
              let items: any[] = data.items;
              let subproposalsGroup: any = this.groupBy('subset', items);

              if (!order || order === 'dip' || order === 'dipName') {
                this.sortSubproposalsGroups(subproposalsGroup);
              }

              const subsetRows: ISubsetDataElement[] = [];
              const components: ComponentDip[] = this.dataSourceTable.data[
                index
              ].components;
              let indexComp: number;
              let componentDipTitle = '';

              for (const key in subproposalsGroup) {
                row.expanded = true;
                if (
                  Object.prototype.hasOwnProperty.call(subproposalsGroup, key)
                ) {
                  indexComp = components.findIndex(
                    (item) => item.cName === key
                  );
                  if (indexComp !== -1) {
                    componentDipTitle = components[indexComp].cTitle;
                  }
                  subsetRows.push({ subset: key, title: componentDipTitle });
                }
              }
              let subsetSortedRows: any[] = (subsetRows as []).sort(function (
                a: any,
                b: any
              ) {
                return +(a.subset as string).split('c')[1] <
                  +(b.subset as string).split('c')[1]
                  ? -1
                  : 1;
              });
              row.subsetRows = subsetSortedRows;
              row.subproposalsGroup = subproposalsGroup;
              row.expanded = true;
              this.cdr.detectChanges();
            },
            (error) => {
              this.dataSourceTable.data[index]['loadingSubproposals'] = false;
              console.log(error);
            }
          );
      }
    }
  }

  groupBy(field, arr: any[]): any {
    let group: any = arr.reduce((r, a) => {
      r[a[field]] = [...(r[a[field]] || []), a];
      return r;
    }, {});

    return group;
  }

  addSubsetField = (item: any) => {
    let subset: string = (item.dipName as string)?.split('SP')[0];
    item.subset = subset;

    // this conditional is only to fix some css issue
    if (!item.sentenceSummary) {
      item.sentenceSummary = '<p style="width:150px;"></p>'; // this is just to allow the arrow of the align the sentence summary with others arrows
    }

    return item;
  };

  sortSubproposalsGroups(subproposalsGroup: any) {
    for (const key in subproposalsGroup) {
      if (Object.prototype.hasOwnProperty.call(subproposalsGroup, key)) {
        let element: any[] = subproposalsGroup[key];
        subproposalsGroup[key] = this.sortSubproposalGroup(element);
      }
    }
  }

  sortSubproposalGroup(arr: any[]) {
    return arr.sort(function (a: any, b: any) {
      return (a.dipName as string).includes('SP') &&
        a.dipName.split('SP').length > 1
        ? +a.dipName.split('SP')[1] < +b.dipName.split('SP')[1]
          ? -1
          : 1
        : 1;
    });
  }

  // usefull for stop event click propagation when button for get subproposals is disabled and clicked
  onClickButtonCaptureEvent(e: Event) {
    e.stopPropagation();
  }

  ngOnDestroy() {
    this.subscriptionSearchService.unsubscribe();
    this.subscriptionFilterService.unsubscribe();
  }
}

export interface DataElement {
  position: number;
  title: string;
  sentenceSummary: string;
  paragraphSummary: string;
  status: string;
  github: string;
  forum: string;
  proposal: string;
}
