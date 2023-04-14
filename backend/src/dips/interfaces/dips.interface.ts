import { Language, Reference, Section } from "../entities/dips.entity";

export interface IDIPs {
  id?: string;
  file?: string;
  filename?: string;
  language?: Language;
  hash?: string;
  dip?: number;
  dipName?: string;
  subproposal?: number;
  proposal?: string;
  title?: string;
  preambleTitle?: string;
  author?: string[];
  contributors?: string[];
  tags?: string[];
  status?: string;
  types?: string;
  dateProposed?: string;
  dateRatified?: string;
  dependencies?: string[];
  replaces?: string;
  sentenceSummary?: string;
  paragraphSummary?: string;
  sections?: Section[];
  sectionsRaw?: string[];
  references?: Reference[];
  subproposalsCount?: number;
  votingPortalLink?: string;
  forumLink?: string;
  dipCodeNumber?:string;
  dipName_plain?: string;
  filename_plain?: string;
  proposal_plain?: string;
  title_plain?: string;
  sectionsRaw_plain?: string[];
}

export interface IGitFile {
  _id?: string;
  filename: string;
  hash: string;
  language: Language;
}
export interface ISynchronizeData {
  creates: number;
  updates: number;
  deletes: number;
}

export interface IPreamble {
  dip?: number;
  title?: string;
  preambleTitle?: string;
  dipName?: string;
  author?: string[];
  extra?: string[];
  contributors?: string[];
  tags?: string[];
  status?: string;
  types?: string;
  dateProposed?: string;
  dateRatified?: string;
  dependencies?: string[];
  replaces?: string;
  votingPortalLink?: string;
  forumLink?: string;
}
