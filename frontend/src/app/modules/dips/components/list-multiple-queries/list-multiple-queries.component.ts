import {
  animate,
  AnimationEvent,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LangService } from 'src/app/services/lang/lang.service';
import { DipsService } from '../../services/dips.service';
import { OrderService } from '../../services/order.service';
import { QueryParamsListService } from '../../services/query-params-list.service';
import { ComponentDip } from '../../types/component-dip';
import { IDip } from '../../types/dip';
import { IMultipleQueryDataElement } from '../../types/multiple-query-data-item';
import {
  Order,
  OrderDirection,
  OrderField,
  OrderFieldName,
} from '../../types/order';
import { ISubsetDataElement } from '../../types/subset';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-multiple-queries',
  templateUrl: './list-multiple-queries.component.html',
  styleUrls: ['./list-multiple-queries.component.scss'],
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
  ],
})
export class ListMultipleQueriesComponent implements OnInit, OnDestroy {
  dataSourceTable = new MatTableDataSource<any>();
  dipsAux: IDip[] = [];
  dataSourceMultiQueriesRows: IMultipleQueryDataElement[] = [];
  columnsToDisplayMultiQueries = ['queryName'];
  isArrowDipsetDownOnMouseOver = false;
  limit = 10;
  order: string = 'dip';
  loading: boolean = false;
  columnsToDisplay = ['pos', 'title', 'summary', 'status', 'links'];
  currentSortingColumn: string = '';
  ascOrderSorting: boolean = true;
  initialized: boolean = false;
  displayWidth: number = window.innerWidth;
  subscriptionOrderService: Subscription;
  @Output() changeOrder = new Subject<{
    orderText: string;
    orderObj: Order;
  }>();
  @Input() darkMode: boolean = false;
  @Output() isExpanded
  @Input() shouldBeExpandedMultiQuery
  @Input() hideParent:boolean
  @Input() statusParameters

  constructor(
    private dipsService: DipsService,
    private orderService: OrderService,
    private queryParamsListService: QueryParamsListService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private langService: LangService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.langService.currentLang$.subscribe((language: string) => {
      this.translate.use(language);
    });
    this.order = this.orderService.order.field
      ? OrderDirection[this.orderService.order.direction] +
        OrderField[this.orderService.order.field]
      : 'dip dipName';

    this.currentSortingColumn =
      this.orderService.order.field == OrderFieldName[OrderFieldName.Number]
        ? 'pos'
        : (OrderFieldName[
            this.orderService.order.field
          ] as string)?.toLowerCase();
    this.ascOrderSorting = this.orderService.order.direction == 'ASC';
    this.initialized = true;

    this.subscriptionOrderService = this.orderService.orderObs$.subscribe(
      (data) => {
        if (this.initialized) {
          this.order = this.orderService.order.field
            ? OrderDirection[this.orderService.order.direction] +
              OrderField[this.orderService.order.field]
            : 'dip dipName';
          this.currentSortingColumn =
            this.orderService.order.field ==
            OrderFieldName[OrderFieldName.Number]
              ? 'pos'
              : (OrderFieldName[
                  this.orderService.order.field
                ] as string)?.toLowerCase();
          this.ascOrderSorting = this.orderService.order.direction == 'ASC';

          this.queryRows();
        }
      }
    );

    window.onresize = () => {
      this.displayWidth = window.innerWidth;
      this.cdr.detectChanges();
    };

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

  queryRows() {
    this.dataSourceMultiQueriesRows = [];
    const queryParams = this.queryParamsListService.queryParams;

    for (const key in queryParams) {
      if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
        const element = queryParams[key];

        const newQueryEle = {
          queryName: key,
          query: element,
          expanded: true,
          page: 0,
          dips: [],
          loading: false,
          limitAux: 10,
        };

        if (key.includes('_')) {
            this.dataSourceMultiQueriesRows.push(newQueryEle);
        }
        this.onExpandQuery(newQueryEle, this.shouldBeExpandedMultiQuery);
      }
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

      this.orderService.orderObs.next(order);
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

      this.orderService.orderObs.next(order);
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
    this.dataSourceMultiQueriesRows.forEach((item) => {
      item.limitAux = 10;
    });
    this.dataSourceMultiQueriesRows.forEach((item) => {
      item.page = 0;
    });
    this.order = text;
  }

  onMouseOverLeaveDipsetArrow(dipset: any, value: boolean) {
    this.isArrowDipsetDownOnMouseOver = value;
  }
  onExpandQuery(row: IMultipleQueryDataElement, shouldBeExpandedMultiQuery?: boolean) {
    const queryParams = this.queryParamsListService.queryParams;
    if (shouldBeExpandedMultiQuery) {
      this.searchDips(row);
      return;
    }

    if (row.expanded) {
      row.expanded = false;
    } else {
      this.searchDips(row);
    }
  }





  searchDips(row: IMultipleQueryDataElement) {
    if (!row.loading) {
      row.loading = true;
      this.dipsService
        .searchDips(
          this.limit,
          row.page,
          this.order,
          row.query,
          null,
          'title proposal filename dipName paragraphSummary sentenceSummary dip status dipFather components subproposalsCount forumLink votingPortalLink dipCodeNumber'
        )
        .pipe(
          map((res) => {
            (res.items as IDip[]).map((item) => {
              item.showArrowExpandChildren = true;
              return item;
            });

            return res;
          })
        )
        .subscribe(
          (data: any) => {
            this.hidingSubproposalsUnderParents(data, row);
            row.expanded = true;
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  async hidingSubproposalsUnderParents(
    data,
    row: IMultipleQueryDataElement
  ): Promise<any> {
    let newData: IDip[] = [];
    const forLoop = async () => {
      for (let index = 0; index < data.items.length; index++) {
        const item: IDip = data.items[index];
        const indexFatherInDips = this.indexFather(item, row.dips);
        const indexFatherInNewData = this.indexFather(item, newData);

        if (
          item.proposal !== '' &&
          indexFatherInDips === -1 &&
          indexFatherInNewData === -1
        ) {
          this.addSubsetField(data.items[index]);
          let res: any = await this.dipsService
            .searchDips(
              1,
              0,
              null,
              null,
              { equals: [{ field: 'dipName', value: item.proposal }] },
              'title proposal filename dipName paragraphSummary sentenceSummary dip status dipFather components subproposalsCount forumLink votingPortalLink dipCodeNumber'
            )
            .toPromise();
          if (res.items[0]) {
            let parent: IDip = res.items[0];
            parent.expanded = true;
            parent.showArrowExpandChildren = true;
            parent.children = [];
            parent.children.push(item);
            let subproposalsGroup: any = this.groupBy(
              'subset',
              parent.children
            );

            if (this.order === 'dip' || this.order === 'dip dipName') {
              this.sortSubproposalsGroups(subproposalsGroup);
            }

            const subsetRows: ISubsetDataElement[] = [];
            const components: ComponentDip[] = parent.components;
            let indexComp: number;
            let componentDipTitle = '';

            for (const key in subproposalsGroup) {
              if (
                Object.prototype.hasOwnProperty.call(subproposalsGroup, key)
              ) {
                indexComp = components?.findIndex((item) => item.cName === key);
                if (indexComp && indexComp !== -1) {
                  componentDipTitle = components[indexComp].cTitle;
                }
                subsetRows.push({
                  subset: key,
                  expanded: true,
                  title: componentDipTitle,
                });
              }
            }

            parent.subproposalsGroup = subproposalsGroup;
            parent.subsetRows = subsetRows;
            newData.push(parent);
          }
        } else if (item.proposal && indexFatherInNewData !== -1) {
          this.addSubsetField(data.items[index]);
          newData[indexFatherInNewData].children.push(item);

          let subproposalsGroup: any = this.groupBy(
            'subset',
            newData[indexFatherInNewData].children
          );

          if (this.order === 'dip' || this.order === 'dip dipName') {
            this.sortSubproposalsGroups(subproposalsGroup);
          }

          const subsetRows: ISubsetDataElement[] = [];
          const components: ComponentDip[] =
            newData[indexFatherInNewData].components;
          let indexComp: number;
          let componentDipTitle = '';

          for (const key in subproposalsGroup) {
            if (Object.prototype.hasOwnProperty.call(subproposalsGroup, key)) {
              indexComp = components?.findIndex((item) => item.cName === key);
              if (indexComp && indexComp !== -1) {
                componentDipTitle = components[indexComp].cTitle;
              }
              subsetRows.push({
                subset: key,
                expanded: true,
                title: componentDipTitle,
              });
            }
          }

          newData[indexFatherInNewData].subproposalsGroup = subproposalsGroup;
          newData[indexFatherInNewData].subsetRows = subsetRows;
          newData[indexFatherInNewData].expanded = true;
          newData[indexFatherInNewData].showArrowExpandChildren = true;
        } else if (item.proposal && indexFatherInDips !== -1) {
          this.addSubsetField(data.items[index]);
          row.dips[indexFatherInDips].expanded = true;
          row.dips[indexFatherInDips].showArrowExpandChildren = true;
          row.dips[indexFatherInDips].children.push(item);

          let subproposalsGroup: any = this.groupBy(
            'subset',
            row.dips[indexFatherInDips].children
          );

          if (this.order === 'dip' || this.order === 'dip dipName') {
            this.sortSubproposalsGroups(subproposalsGroup);
          }

          const subsetRows: ISubsetDataElement[] = [];
          const components: ComponentDip[] =
            row.dips[indexFatherInDips].components;
          let indexComp: number;
          let componentDipTitle = '';

          for (const key in subproposalsGroup) {
            if (Object.prototype.hasOwnProperty.call(subproposalsGroup, key)) {
              indexComp = components?.findIndex((item) => item.cName === key);
              if (indexComp && indexComp !== -1) {
                componentDipTitle = components[indexComp].cTitle;
              }
              subsetRows.push({
                subset: key,
                expanded: true,
                title: componentDipTitle,
              });
            }
          }

          row.dips[indexFatherInDips].subproposalsGroup = subproposalsGroup;
          row.dips[indexFatherInDips].subsetRows = subsetRows;
          row.dips[indexFatherInDips].expanded = true;
        } else if (!item.proposal) {
          const indexItemInLoadedDips = this.indexItemInLoadedDips(
            item,
            row.dips
          );
          const indexItemInLoadedNewdata = this.indexItemInLoadedDips(
            item,
            newData
          );

          if (indexItemInLoadedDips === -1 && indexItemInLoadedNewdata === -1) {
            item.expanded = false;
            item.children = [];
            item.showArrowExpandChildren = false;
            newData.push(item);
          }
        }
      }
    };

    await forLoop();
    this.dipsAux = newData;
    row.dips = row.dips.concat(this.dipsAux);
    row.total = data.total;
    row.loading = false;

    if (row.limitAux >= row.total) {
      row.moreToLoad = false;
    } else {
      row.moreToLoad = true;
    }

    this.cdr.detectChanges();
  }

  indexFather(dip: IDip, dips: IDip[]) {
    return dips.findIndex((item) => dip.proposal === item.dipName);
  }

  indexItemInLoadedDips(dip: IDip, dips: IDip[]) {
    return dips.findIndex((item) => dip.dipName === item.dipName);
  }

  addSubsetField = (item: any) => {
    let subset: string = (item.dipName as string)?.split('SP')[0];
    item.subset = subset;
    return item;
  };

  groupBy(field, arr: any[]): any {
    let group: any = arr.reduce((r, a) => {
      r[a[field]] = [...(r[a[field]] || []), a];
      return r;
    }, {});

    return group;
  }

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

  onSendPagination(row: IMultipleQueryDataElement): void {
    row.page++;
    row.limitAux += 10;
    if (row.moreToLoad) {
      this.searchDips(row);
    }
  }

  resetQueryData(row: IMultipleQueryDataElement) {
    row.dips = [];
    row.page = 0;
    row.limitAux = 10;
    row.loading = false;
    row.moreToLoad = false;
    row.total = 0;
  }

  onAnimationEvent(event: AnimationEvent, row: IMultipleQueryDataElement) {
    if (event.fromState === 'expanded') {
      this.resetQueryData(row);
    }
  }

  ngOnDestroy() {
    this.subscriptionOrderService.unsubscribe();
  }
}
