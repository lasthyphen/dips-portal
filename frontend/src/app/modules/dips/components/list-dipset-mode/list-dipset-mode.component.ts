import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {Component, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';
import { LangService } from 'src/app/services/lang/lang.service';
import { FilterService } from '../../services/filter.service';
import { DipsService } from '../../services/dips.service';
import { OrderService } from '../../services/order.service';
import { SearchService } from '../../services/search.service';
import { SmartSearchService } from '../../services/smart-search.service';
import { StatusService } from '../../services/status.service';
import { ComponentDip } from '../../types/component-dip';
import IFilter from '../../types/filter';
import { IDip } from '../../types/dip';
import { IDIPsetDataElement } from '../../types/dipset';
import {
  Order,
  OrderDirection,
  OrderField,
  OrderFieldName,
} from '../../types/order';
import { ISubsetDataElement } from '../../types/subset';
const clone = require('rfdc')();

@Component({
  selector: 'app-list-dipset-mode',
  templateUrl: './list-dipset-mode.component.html',
  styleUrls: ['./list-dipset-mode.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
    trigger('dipsetExpand', [
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
export class ListDipsetModeComponent implements OnInit, OnDestroy {
  dataSourceDipsetRows: IDIPsetDataElement[] = [];
  columnsToDisplayDipset = ['dipset'];
  dataSourceTable = new MatTableDataSource<any>();
  expandedElementDipset: IDIPsetDataElement | null;
  isArrowDipsetDownOnMouseOver = false;
  currentDipsetRowOver: any;
  isArrowDownOnMouseOver: boolean = false;
  currentRowOver: any;
  dipSets: any = {};
  limit = 10;
  limitAux = 10;
  page = 0;
  order: string = 'dip';
  search: string = '';
  filter: IFilter;
  filterClone: any;
  total: number;
  columnsToDisplay = ['pos', 'title', 'summary', 'status', 'links'];
  currentSortingColumn: string = '';
  ascOrderSorting: boolean = true;
  arrowUp: string = '../../../../../assets/images/up.svg';
  arrowDown: string = '../../../../../assets/images/down.svg';
  arrowUpDark: string = '../../../../../assets/images/up_dark.svg';
  arrowDownDark: string = '../../../../../assets/images/down_dark.svg';
  initialized: boolean = false;
  subscriptionSearchService: Subscription;
  subscriptionFilterService: Subscription;
  subscriptionOrderService: Subscription;
  @Output() changeOrder = new Subject<{
    orderText: string;
    orderObj: Order;
  }>();
  selected = '-1';
  _expandedItems: ExpandedItems = {
    subproposals: true,
    summary: false,
  };

  @Input() loading = false;
  @Input() error = false;

  get expandedItems() {
    return this._expandedItems;
  }

  set expandedItems(value) {
    this._expandedItems = { ...value };
  }

  constructor(
    private smartSearchService: SmartSearchService,
    private dipsService: DipsService,
    private searchService: SearchService,
    private filterService: FilterService,
    private statusService: StatusService,
    public darkModeService: DarkModeService,
    private orderService: OrderService,
    private translate: TranslateService,
    private langService: LangService
  ) {
    this.translate.setDefaultLang('en');
  }


  ngOnInit(): void {
    this.langService.currentLang$.subscribe((language: string) => {
      this.translate.use(language);
    });
    this.order =
      OrderDirection[this.orderService.order.direction] +
      OrderField[this.orderService.order.field];
    this.currentSortingColumn =
      this.orderService.order.field == OrderFieldName[OrderFieldName.Number]
        ? 'pos'
        : (OrderFieldName[
            this.orderService.order.field
          ] as string)?.toLowerCase();
    this.ascOrderSorting = this.orderService.order.direction == 'ASC';
    this.initialized = true;
    this.subscriptionSearchService = this.searchService.search$.subscribe(
      (data) => {
        this.search = data;
        this.searchTagsDipset();
      }
    );
    this.subscriptionFilterService = this.filterService.filter$.subscribe(
      (data) => {
        this.filter = data;
        this.filterClone = clone(this.filter);
        let index = this.filterClone.equals.findIndex(
          (item) => item.field === 'proposal'
        );
        this.filterClone.equals.splice(index, 1); // include subproposals in searching
        this.searchTagsDipset();
      }
    );

    this.subscriptionOrderService = this.orderService.orderObs$.subscribe(
      (data) => {
        if (this.initialized) {
          this.order =
            OrderDirection[this.orderService.order.direction] +
            OrderField[this.orderService.order.field];
          this.currentSortingColumn =
            this.orderService.order.field ==
            OrderFieldName[OrderFieldName.Number]
              ? 'pos'
              : (OrderFieldName[
                  this.orderService.order.field
                ] as string)?.toLowerCase();
          this.ascOrderSorting = this.orderService.order.direction == 'ASC';

          this.searchTagsDipset();
        }
      }
    );

    // this data is to fill the dipset table in order to align this table with the sub tables
    // but the row containing this data will be collapsed
    this.dataSourceTable.data = [
      {
        proposal: '',
        dipFather: true,
        dip: -1,
        dipName: 'NODIP',
        sentenceSummary:
          'DIP defines a standardized application form used to kick off the process of onboarding a new collateral asset to the Maker Protocol.',
        status: 'Accepted',
        title: '',
        subproposalsCount: 2,
        votingPortalLink: '',
        forumLink: '',
        dipCodeNumber: 'NODIP',
      },
    ];
  }

  searchTagsDipset() {
    this.loading = true;
    this.smartSearchService
      .getTags()
      .pipe(
        map((tags: any[]) => {
          let modifiedTags: any[] = tags
            .filter((item: any) => (item.tag as string).endsWith('-dipset'))
            .map((i) => {
              return {
                dipset: i.tag,
              };
            })
            .sort((a: any, b: any) => (a.dipset < b.dipset ? -1 : 1));

          return modifiedTags;
        })
      )
      .subscribe(
        async (data: any[]) => {
          let promises = await data.map((item) =>
            this.getAtLeastOneElementByTag(item.dipset)
          );
          let dips: any[] = await Promise.all(promises);
          this.dataSourceDipsetRows = data.filter((_, index) => {
            return dips[index].items && dips[index].items.length > 0;
          });

          if (!this.search){
            this.dataSourceDipsetRows.forEach((item: IDIPsetDataElement) => {
              this.dipSets[item.dipset] = [];
              item.expanded = false;
            });
          }
          else {
            this.dataSourceDipsetRows.forEach((item: IDIPsetDataElement) => {
              item.expanded = false;
              this.onExpandDipset(item);
            });
          }
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  onMouseOverLeaveDipsetArrow(dipset: any, value: boolean) {
    this.isArrowDipsetDownOnMouseOver = value;
    this.currentDipsetRowOver = dipset;
  }

  onMouseOverLeaveArrow(id: any, value: boolean) {
    this.isArrowDownOnMouseOver = value;
    this.currentRowOver = id;
  }

  onExpandDipset(row: IDIPsetDataElement) {
    if (row.expanded) {
      row.expanded = false;
    } else {
      let filter = clone(this.filterClone);
      filter.contains.push({ field: 'tags', value: row.dipset });
      this.dipsService
        .searchDips(
          this.limit,
          this.page,
          this.order,
          this.search,
          filter,
          'title proposal filename dipName paragraphSummary sentenceSummary dip status dipFather components subproposalsCount forumLink votingPortalLink dipCodeNumber'
        )
        .subscribe(
          (data) => {
            this.dipSets[row.dipset] = data.items;
            row.expanded = true;
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  async expandFirstDipset(row: IDIPsetDataElement) {
    try {
      let filter = clone(this.filterClone);
      filter.contains.push({ field: 'tags', value: row.dipset });

      let data: any = await this.dipsService
        .searchDips(
          this.limit,
          this.page,
          this.order,
          this.search,
          filter,
          'title proposal filename dipName paragraphSummary sentenceSummary dip status dipFather components subproposalsCount forumLink votingPortalLink dipCodeNumber'
        )
        .toPromise();
      this.dipSets[row.dipset] = data.items;
      row.expanded = true;

      return;
    } catch (error) {
      console.log(error);
    }
  }

  deleteFilterInarray(array: Array<any>, data: any) {
    let index = array.findIndex(
      (i) => i.field === data.field && i.value === data.value
    );

    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  onSendOrder(value: string): void {
    let orderPrefix = '';
    if (this.ascOrderSorting === true || this.currentSortingColumn !== value) {
      if (this.currentSortingColumn === value) {
        this.ascOrderSorting = !this.ascOrderSorting;
        orderPrefix = this.ascOrderSorting ? '' : '-';
      } else {
        this.ascOrderSorting = true;
        this.currentSortingColumn = value;
      }

      this.setOrder(orderPrefix + this.transforValue(value));

      let order: Order = {
        field:
          this.currentSortingColumn == 'pos'
            ? 'Number'
            : this.toOrderBy(this.currentSortingColumn),
        direction: this.ascOrderSorting ? 'ASC' : 'DESC',
      };

      this.orderService.order = order;

      this.changeOrder.next({
        orderText: orderPrefix + this.transforValue(value),
        orderObj: order,
      });
      this.order =
        OrderDirection[this.orderService.order.direction] +
        OrderField[this.orderService.order.field];

      this.searchTagsDipset();
    } else {
      this.currentSortingColumn = '';
      this.ascOrderSorting = true;

      let order: Order = {
        field: 'Number',
        direction: 'ASC',
      };

      this.orderService.order = order;
      this.changeOrder.next({
        orderText: 'dip dipName',
        orderObj: order,
      });
      this.order =
        OrderDirection[this.orderService.order.direction] +
        OrderField[this.orderService.order.field] +
        ' dipName';

      this.searchTagsDipset();
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

  setOrder(text: string): void {
    this.limitAux = 10;
    this.page = 0;
    this.order = text;
    this.expandedElementDipset = null;
  }

  getAtLeastOneElementByTag(tag: string): Promise<any> {
    let filter = clone(this.filterClone);
    filter.contains.push({ field: 'tags', value: tag });
    return this.dipsService
      .searchDips(1, 0, this.order, this.search, filter, 'title dipName')
      .toPromise();
  }

  getStatusValue(data: string): string {
    return this.statusService.getStatusValue(data);
  }

  getStatusType(data: string): string {
    return this.statusService.getStatusType(data);
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

  onGetSubproposals(row: IDip, dipset: string, e: Event) {
    e.stopPropagation();

    if (row.expanded) {
      row.expanded = false;
    } else {
      let index = this.dipSets[dipset].findIndex(
        (item) => item._id === row._id
      );
      // show subproposals children
      if (index !== -1) {
        this.dipSets[dipset][index]['loadingSubproposals'] = true;
        let filter = clone(this.filter);
        filter['equals'] = [];
        filter.equals.push({ field: 'proposal', value: row.dipName });
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

        this.dipsService
          .searchDips(
            100000,
            0,
            // 'dipName',
            order,
            row.showArrowExpandChildren ? this.search : '',
            filter,
            'title proposal dipName filename paragraphSummary sentenceSummary dip status forumLink votingPortalLink'
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
              this.dipSets[dipset][index]['loadingSubproposals'] = false;
              let items: any[] = data.items;
              let subproposalsGroup: any = this.groupBy('subset', items);

              if (!order || order === 'dip' || order === 'dipName') {
                this.sortSubproposalsGroups(subproposalsGroup);
              }

              const subsetRows: ISubsetDataElement[] = [];
              const components: ComponentDip[] = this.dipSets[dipset][index]
                .components;
              let indexComp: number;
              let componentDipTitle = '';

              for (const key in subproposalsGroup) {
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
              // this.cdr.detectChanges();
            },
            (error) => {
              this.dipSets[dipset][index]['loadingSubproposals'] = false;
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

  updateSelected(index: string, event: Event): void {
    event.stopPropagation();

    if (this.selected === index) {
      this.selected = '-1';
    } else {
      this.selected = index;
    }
  }

  ngOnDestroy() {
    this.subscriptionSearchService.unsubscribe();
    this.subscriptionFilterService.unsubscribe();
    this.subscriptionOrderService.unsubscribe();
  }
}

interface ExpandedItems {
  subproposals: boolean;
  summary: boolean;
}
