export default interface QueryParams {
  status?: string[];
  search?: string;
  contributor?: string;
  author?: string;
  dipsetMode?: boolean;
  hideParents?: boolean;
  customViewName?: string;
  orderBy?: string;
  orderDirection?: string;
  lang?:string;
  shouldBeExpandedMultiQuery?:boolean
}
