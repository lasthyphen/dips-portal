import { IDip } from './dip';

export interface IMultipleQueryDataElement {
  queryName: string;
  query?: string;
  expanded?: boolean;
  moreToLoad?: boolean;
  limitAux?: number;
  dips?: IDip[];
  page?: number;
  total?: number;
  loading?: boolean;
}
