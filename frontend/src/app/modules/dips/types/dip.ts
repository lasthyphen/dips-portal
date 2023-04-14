import { ComponentDip } from "./component-dip";
import { ISubsetDataElement } from "./subset";

export interface IDip {
  _id?: string;
  title?: string;
  proposal?: string;
  filename?: string;
  dipName?: string;
  paragraphSummary?: string;
  sentenceSummary?: string;
  dip?: number;
  status?: string;
  dipFather?: string;
  children?: IDip[];
  subset?: string;
  expanded?: boolean;
  hide?: boolean;
  subproposalsGroup?: any;
  subsetRows?: ISubsetDataElement[];
  expandedSummary?: boolean;
  showArrowExpandChildren?: boolean;
  components: ComponentDip[]
}
