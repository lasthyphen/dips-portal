import { Filters } from "@app/dips/dto/query.dto";
import { Component, Language, DIP, Reference } from "@app/dips/entities/dips.entity";
import { IGitFile, IPreamble, ISynchronizeData } from "@app/dips/interfaces/dips.interface";
import { RequestDocument } from "graphql-request";
import { PullResult } from "simple-git";
const faker = require("faker");

faker.seed('Data');

export const dipNumber_1 = faker.datatype.number({ min: 1, max: 10 });
export const dipNumber_2 = faker.datatype.number({ min: 1, max: 10 });

const filename: string = `DIP${dipNumber_1}/DIP${dipNumber_1}.md`;
const sentenceSummary: string = faker.lorem.paragraph();
export const paragraphSummaryMock: string = faker.lorem.paragraph();
export const authorMock: string[] = [`${faker.name.firstName()} ${faker.name.lastName()}`, `${faker.name.firstName()} ${faker.name.lastName()}`,];
export const contributorsMock: string[] = [faker.random.word()];
export const dateProposedMock: string = faker.date.past('YYYY-MM-DD').toString();
export const dateRatifiedMock: string = faker.date.past('YYYY-MM-DD').toString();
export const dependenciesMock: string[] = [faker.random.word()];
export const votingPortalLinkMock: string = faker.internet.url();
const dip = dipNumber_1;
export const replacesMock: string = faker.random.word();
export const statusMock: string = faker.random.arrayElement(['Accepted', 'Rejected', 'RFC']);
export const titleMock: string = faker.lorem.paragraph();
export const typesMock: string = faker.random.word();
export const forumLinkMock: string = faker.random.word();
export const tagsMock: string = faker.random.word();
export const extraMock: string = faker.random.word();

// ParseDIPsCommand unit test
export const errorDropMock: string = faker.lorem.paragraph();

// ParseQueryService unit tests
export const tagsMock_1: string = faker.random.word();
export const tagsMock_2: string = faker.random.word();
export const tagsMock_3: string = faker.random.word();

// DIPsController unit tests
export const limitMock: string = faker.datatype.number();
export const pageMock: string = faker.datatype.number();
export const orderMock: string = faker.random.word();
export const selectMock: string = faker.random.word();
export const languageMock: Language = faker.random.arrayElement([Language.English, Language.Spanish]);
export const searchMock: string = faker.random.word();
export const fieldMock: string = faker.random.word();
export const valueMock: string = faker.random.word();
export const filtersMock: Filters = {
  contains: [
    {
      field: faker.random.word(),
      value: faker.random.word(),
    }
  ],
  notcontains: [
    {
      field: faker.random.word(),
      value: faker.random.word(),
    }
  ],
  notequals: [
    {
      field: faker.random.word(),
      value: faker.random.word(),
    }
  ],
  equals: [
    {
      field: faker.random.word(),
      value: faker.random.word(),
    }
  ],
  inarray: [{
    field: faker.random.word(),
    value: [faker.random.word(), faker.random.word()],
  }],
};
export const metaVarsMock = [{
  language: languageMock.toString(),
  translations: languageMock.toString(),
}];
export const pullRequestMock = {
  name: faker.random.word(),
}
export const dipNameMock: string = faker.random.word();
export const parseResultMock: boolean = faker.datatype.boolean();
export const requestCallBackMock = {
  headers: {
    "x-hub-signature": faker.random.word(),
  },
  body: {
    field: faker.random.word(),
  },
};
export const requestCallBackNotHeaderMock = {
  headers: {},
  body: {
    field: faker.random.word(),
  },
};

// DIPsService unit tests
export const searchFieldMock: string = faker.random.word();
export const parseMock: string = faker.random.word();
export const builtFilterMock = {
  language: languageMock,
  [fieldMock]: {
    $regex: new RegExp(`${valueMock}`),
    $options: "i",
  },
};
export const builtContainsFilterMock = {
  [filtersMock.contains[0].field]: {
    $regex: new RegExp(`${filtersMock.contains[0].value}`),
    $options: "i",
  },
};
export const builtEqualsFilterMock = {
  [filtersMock.equals[0].field]: filtersMock.equals[0].value,
};
export const builtInArrayFilterMock = {
  [filtersMock.inarray[0].field]: {
    $in: [filtersMock.inarray[0].value[0], filtersMock.inarray[0].value[1]],
  },
};
export const builtNotContainsFilterMock = {
  [filtersMock.notcontains[0].field]: {
    $not: {
      $regex: new RegExp(`${filtersMock.notcontains[0].value}`),
      $options: "i",
    },
  },
};
export const builtNotEqualFilterMock = {
  [filtersMock.notequals[0].field]: {
    $ne: filtersMock.notequals[0].value,
  },
};
export const tagMock: string = faker.random.word();
export const tagsQueryMock = {
  type: 'LITERAL',
  name: '#' + tagMock,

};
export const builtTagFilterMock = {
  tags: {
    $in: [tagMock]
  }
};
export const statusQueryMock = {
  type: 'LITERAL',
  name: '@' + statusMock,
};
export const builtStatusFilterMock = {
  status: {
    $regex: new RegExp(statusMock),
    $options: "i",
  },
};
export const orQueryMock = {
  type: 'OPERATION',
  op: 'or',
  left: [
    tagsQueryMock,
    statusQueryMock,
  ],
};
export const builtOrFilterMock = {
  $or: [
    builtTagFilterMock,
    builtStatusFilterMock,
  ],
};
export const notTagQueryMock = {
  type: 'OPERATION',
  op: 'not',
  left: '#' + tagMock,
};
export const builtNotTagFilterMock = {
  tags: {
    $nin: [tagMock],
  }
};
export const notStatusQuery = {
  type: 'OPERATION',
  op: 'not',
  left: '@' + statusMock,
};
export const builtNotStatusFilterMock = {
  status: {
    $not: {
      $regex: new RegExp(statusMock),
      $options: "i",
    },
  },
};
export const andQueryMock = {
  type: 'OPERATION',
  op: 'and',
  left: [
    orQueryMock,
    notTagQueryMock,
    notStatusQuery],
};
export const builtAndFilterMock = {
  $and: [
    builtOrFilterMock,
    builtNotTagFilterMock,
    builtNotStatusFilterMock,
  ]
};
export const dipToBeSearcheableMock: DIP = {
  dipName: dipNameMock,
  filename: faker.random.word(),
  proposal: faker.random.word(),
  title: titleMock,
  sectionsRaw: [faker.random.word()],
} as any;
export const dipSearcheableMock: DIP = {
  ...dipToBeSearcheableMock,
  dipName_plain: dipNameMock,
  filename_plain: dipToBeSearcheableMock.filename,
  proposal_plain: dipToBeSearcheableMock.proposal,
  title_plain: titleMock,
  sectionsRaw_plain: dipToBeSearcheableMock.sectionsRaw,
} as any;
export const fileNameMock: string = faker.random.word();
export const proposalMock: string = faker.random.word();
export const deleteDipresult = {
  n: faker.datatype.number(),
  ok: faker.datatype.number(),
  deletedCount: faker.datatype.number(),
};

// PullRequestService unit test
export const countPullRequestMock: number = faker.datatype.number();
export const insertManyMock: boolean = faker.datatype.boolean();

// SimpleGitService unit test
export const cloneMessageMock: string = faker.random.word();
export const pullMock: PullResult = {
  files: [faker.random.word()],
  created: [faker.random.word()],
  deleted: [faker.random.word()],
  deletions: null,
  insertions: null,
  remoteMessages: null,
  summary: null,
};
export const pullErrorMock: string = faker.random.word();
export const hashMock: string = faker.random.word();
export const rawResultMock: string = hashMock + ' ' + hashMock + '\t' + fileNameMock + '\t' + fileNameMock + '.md';
export const longerRawResultMock: string = faker.random.word() + ' ' + rawResultMock;
export const getFilesResultMock = [
  {
    filename: fileNameMock + '.md',
    hash: hashMock,
    language: languageMock,
  },
  {
    filename: fileNameMock + '.md',
    hash: hashMock,
    language: languageMock,
  },
];
export const getLongerFilesResultMock = [
  {
    filename: fileNameMock + ' ' + fileNameMock + '.md',
    hash: hashMock,
    language: languageMock,
  },
  {
    filename: fileNameMock + ' ' + fileNameMock + '.md',
    hash: hashMock,
    language: languageMock,
  },
];
export const languageFileNameMock: string = "I18N/" + languageMock + '/';
export const readFileResultMock: string = faker.random.word();
export const translationMetaVarsMock = [{
  language: Language.English,
  translations: readFileResultMock,
}];
export const errorReadFileMock: string = faker.random.word();

// ParseDIPsService unit tests
export const dipMock = {
  filename: faker.random.word(),
  hash: faker.random.word(),
  language: faker.random.arrayElement([Language.English, Language.Spanish]),
  file: faker.random.word(),
  _id: faker.datatype.uuid(),
};
export const synchronizeDataMock: ISynchronizeData = {
  creates: 1,
  deletes: 1,
  updates: 1,
};
export const gitFileMock: IGitFile = {
  ...dipMock,
  language: faker.random.arrayElement([Language.English, Language.Spanish]),
};
export const dipMapMock: Map<string, IGitFile> = new Map();
export const mapKeyMock: string = faker.random.word();
dipMapMock.set(mapKeyMock, gitFileMock);
export const edgesMock: string = faker.random.word();
export const totalCountMock: number = faker.datatype.number({ min: 2, max: 4 });
export const countMock: number = faker.datatype.number({ min: 1, max: totalCountMock - 1 });
export const headingOutComponentSummaryParsed: string = `DIP${dipNumber_1}c13 is a Process DIP component that allows the removal of core personnel using a subproposal. [DIP${dipNumber_1}c13](dips/details/DIP${dipNumber_1}#DIP${dipNumber_1}c13 \"smart-Component\") subproposals have the following parameters:`;
export const componentSummaryParsed: string = `## Component Summary ${dipNumber_1}\n\n`;
export const componentSummaryParsed_1: string = `[DIP${dipNumber_1}c13: Core Personnel Offboarding](dips/details/DIP${dipNumber_1}#DIP${dipNumber_1}c13 "NON-SMART-LINK")  ` 
+ `\nA process component that defines the process to remove personnel from the DIP Editor or Governance Facilitator roles.`;
export const titleParsed: string = `# DIP${dipNumber_1}: ${titleMock}\n\n`;
export const filesGitMock: IGitFile[] = [{
  ...dipMock,
  filename,
}];
export const dipWithoutNameMock = {
  ...dipMock,
  dip: undefined,
  dipName: undefined,
};
export const referenceMock: Reference = {
  link: faker.internet.url(),
  name: faker.random.word(),
};
export const sectionNameMock: string = `DIP${dipNumber_1}c${faker.datatype.number({ min: 1, max: 30 })}`;
export const markedListMock: any[] = [
  {
    type: 'heading',
    depth: 1,
    text: faker.random.word(),
  },
  {
    type: 'heading',
    depth: 2,
    text: `${sectionNameMock}:`,
  }
];
export const parseStringMock: string = `DIP#: ${dipNumber_1}`;
export const openIssuemock: string = faker.random.word();
export const components: Component[] = [
  {
    cBody: "Defines several concepts that are important for understanding the DIPs process.",
    cName: `DIP${dipNumber_1}c1`,
    cTitle: "Definitions of the Maker Improvement Proposal Framework"
  },
  {
    cBody: "Discusses some core principles that all DIPs should aim to follow.",
    cName: `DIP${dipNumber_1}c2`,
    cTitle: "Core Principles"
  },
  {
    cBody: "Lays out how a DIP is created and moves through the process to become Accepted or Rejected.",
    cName: `DIP${dipNumber_1}c3`,
    cTitle: "The DIP Lifecycle"
  },
  {
    cBody: "Discusses the use of components to compartmentalize and organise DIPs",
    cName: `DIP${dipNumber_1}c4`,
    cTitle: "DIP Components and DIP Component Types"
  },
  {
    cBody: "Discusses how DIPs can be replaced and the steps to be taken to maintain dependencies.",
    cName: `DIP${dipNumber_1}c5`,
    cTitle: "DIP Replacement Process"
  },
  {
    cBody: "A component that defines how to include external materials inside DIPs.",
    cName: `DIP${dipNumber_1}c6`,
    cTitle: "Supporting Materials"
  },
  {
    cBody: "Defines the DIP templates for both General and Technical DIPs.",
    cName: `DIP${dipNumber_1}c7`,
    cTitle: "DIP Templates"
  },
  {
    cBody: "Defines the core roles that the DIPs process requires to operate successfully.",
    cName: `DIP${dipNumber_1}c8`,
    cTitle: `DIP${dipNumber_1} Domain Role Dependencies`
  },
  {
    cBody: "List of of personnel currently occupying core roles.",
    cName: `DIP${dipNumber_1}c9`,
    cTitle: "Core Personnel Role List"
  },
  {
    cBody: "A component that defines the responsibilities, criteria and grounds for removal of the DIP Editor role.",
    cName: `DIP${dipNumber_1}c10`,
    cTitle: "DIP Editor Role"
  },
  {
    cBody: "A component that defines the responsibilities, criteria and grounds for removal of the Governance Facilitator role.",
    cName: `DIP${dipNumber_1}c11`,
    cTitle: "Governance Facilitator Role"
  },
  {
    cBody: "A process component that defines the process to add personnel to the DIP Editor or Governance Facilitator roles.",
    cName: `DIP${dipNumber_1}c12`,
    cTitle: "Core Personnel Onboarding"
  },
  {
    cBody: "A process component that defines the process to remove personnel from the DIP Editor or Governance Facilitator roles.",
    cName: `DIP${dipNumber_1}c13`,
    cTitle: "Core Personnel Offboarding"
  }
];
export const componentSummary: string = `**DIP${dipNumber_1}c1: Definitions of the Maker Improvement Proposal Framework**  \n` +
  `Defines several concepts that are important for understanding the DIPs process.\n` +
  `\n` +
  `**DIP${dipNumber_1}c2: Core Principles**  \n` +
  `Discusses some core principles that all DIPs should aim to follow.\n` +
  `\n` +
  `**DIP${dipNumber_1}c3: The DIP Lifecycle**  \n` +
  `Lays out how a DIP is created and moves through the process to become Accepted or Rejected.\n` +
  `\n` +
  `**DIP${dipNumber_1}c4: DIP Components and DIP Component Types**  \n` +
  `Discusses the use of components to compartmentalize and organise DIPs\n` +
  `\n` +
  `**DIP${dipNumber_1}c5: DIP Replacement Process**  \n` +
  `Discusses how DIPs can be replaced and the steps to be taken to maintain dependencies.\n` +
  `\n` +
  `**DIP${dipNumber_1}c6: Supporting Materials**\n` +
  `A component that defines how to include external materials inside DIPs.\n` +
  `\n` +
  `**DIP${dipNumber_1}c7: DIP Templates**  \n` +
  `Defines the DIP templates for both General and Technical DIPs.\n` +
  `\n` +
  `**DIP${dipNumber_1}c8: DIP${dipNumber_1} Domain Role Dependencies**  \n` +
  `Defines the core roles that the DIPs process requires to operate successfully.\n` +
  `\n` +
  `**DIP${dipNumber_1}c9: Core Personnel Role List**  \n` +
  `List of of personnel currently occupying core roles.\n` +
  `\n` +
  `**DIP${dipNumber_1}c10: DIP Editor Role**  \n` +
  `A component that defines the responsibilities, criteria and grounds for removal of the DIP Editor role.\n` +
  `\n` +
  `**DIP${dipNumber_1}c11: Governance Facilitator Role**  \n` +
  `A component that defines the responsibilities, criteria and grounds for removal of the Governance Facilitator role.\n` +
  `\n` +
  `**DIP${dipNumber_1}c12: Core Personnel Onboarding**  \n` +
  `A process component that defines the process to add personnel to the DIP Editor or Governance Facilitator roles.\n` +
  `\n` +
  `**DIP${dipNumber_1}c13: Core Personnel Offboarding**  \n` +
  `A process component that defines the process to remove personnel from the DIP Editor or Governance Facilitator roles.\n` +
  `\n` +
  `\n`;
export const dipFile =
  `# DIP${dipNumber_1}: ${titleMock}\n\n## Preamble` +
  `\n${"```"}\nDIP#: ${dipNumber_1}\nTitle: ${titleMock}\nAuthor(s)` +
  `: ${authorMock[0]}, ${authorMock[1]}\nForum URL: ${forumLinkMock}\nTags: ${tagsMock}\nContributors` +
  `: ${contributorsMock}\nType: ${typesMock}\nRatification Poll URL: ${votingPortalLinkMock}\nStatus: ${statusMock} \nDate Proposed: ${dateProposedMock}` +
  `\nDate Ratified: ${dateRatifiedMock}\nExtra: ${extraMock}\nDependencies: ${dependenciesMock}\nReplaces: ${replacesMock}\n` +
  `${"```"}\n## References\n**[General-DIP-Template.md](General-DIP-Template.m` +
  `d)**  \n**[Technical-DIP-Template.md](Technical-DIP-Template.md)**  \n` +
  `**[DIP${dipNumber_1}c12-Subproposal-Template.md](DIP${dipNumber_1}c12-Subproposal-Template.md)**` +
  `  \n**[DIP${dipNumber_1}c13-Subproposal-Template.md](DIP${dipNumber_1}c13-Subproposal-Template.m` +
  `d)**  \n\n## Sentence Summary\n\n${sentenceSummary}\n\n## Paragraph Summary\n\n${paragraphSummaryMock}\n\n## Compo` +
  `nent Summary ${dipNumber_1}\n\n**DIP${dipNumber_1}c1: Definitions of the Maker Improvement Proposa` +
  `l Framework**  \nDefines several concepts that are important for under` +
  `standing the DIPs process.\n\n**DIP${dipNumber_1}c2: Core Principles**  \nDiscusses` +
  ` some core principles that all DIPs should aim to follow.\n\n**DIP${dipNumber_1}c3:` +
  ` The DIP Lifecycle**  \nLays out how a DIP is created and moves throug` +
  `h the process to become Accepted or Rejected.\n\n**DIP${dipNumber_1}c4: DIP Compone` +
  `nts and DIP Component Types**  \nDiscusses the use of components to co` +
  `mpartmentalize and organise DIPs\n\n**DIP${dipNumber_1}c5: DIP Replacement Process*` +
  `*  \nDiscusses how DIPs can be replaced and the steps to be taken to m` +
  `aintain dependencies.\n\n**DIP${dipNumber_1}c6: Supporting Materials**\nA component` +
  ` that defines how to include external materials inside DIPs.\n\n**DIP${dipNumber_1}` +
  `c7: DIP Templates**  \nDefines the DIP templates for both General and ` +
  `Technical DIPs.\n\n**DIP${dipNumber_1}c8: DIP${dipNumber_1} Domain Role Dependencies**  \nDefine` +
  `s the core roles that the DIPs process requires to operate successfull` +
  `y.\n\n**DIP${dipNumber_1}c9: Core Personnel Role List**  \nList of of personnel cur` +
  `rently occupying core roles.\n\n**DIP${dipNumber_1}c10: DIP Editor Role**  \nA comp` +
  `onent that defines the responsibilities, criteria and grounds for remo` +
  `val of the DIP Editor role.\n\n**DIP${dipNumber_1}c11: Governance Facilitator Role*` +
  `*  \nA component that defines the responsibilities, criteria and groun` +
  `ds for removal of the Governance Facilitator role.\n\n**DIP${dipNumber_1}c12: Core ` +
  `Personnel Onboarding**  \nA process component that defines the process` +
  ` to add personnel to the DIP Editor or Governance Facilitator roles.\n` +
  `\n**DIP${dipNumber_1}c13: Core Personnel Offboarding**  \nA process component that ` +
  `defines the process to remove personnel from the DIP Editor or Governa` +
  `nce Facilitator roles.\n\n\n## Motivation\n\nMakerDAO is evolving into` +
  ` an organization that is trustless, fully decentralized, open-sourced,` +
  ` and self-sustainable. In order to further enable this gradual evoluti` +
  `on while maintaining governance functionality both during this process` +
  ` and after the dissolution of the Maker Foundation, Maker will be gove` +
  `rned using Maker Improvement Proposals (DIPs).\n\nThe purpose of the M` +
  `IPs Framework is to open up the ability to improve Maker Governance an` +
  `d the Maker Protocol to anyone in the community.\n\nBy empowering the ` +
  `participation of the community and other stakeholders to have a standa` +
  `rd approach to proposing improvements, specifications, or process and ` +
  `state changes, the goal is to enable organic growth that will in turn ` +
  `bring MakerDAO closer to self-sustainability.\n\nIn order for DIPs to ` +
  `be functional they need to comply with a basic standard outlining thei` +
  `r internal structure and external dependencies. This standard is DIPs ` +
  `described in DIP${dipNumber_1}, the Maker Improvement Proposal Framework.\n\n\n## S` +
  `pecification / Proposal Details\n\n### DIP${dipNumber_1}c1: Definitions of the Make` +
  `r Improvement Proposal Framework\n\n- **Maker Improvement Proposals (M` +
  `IPs):** are the preferred mechanism for improving Maker Governance and` +
  ` the Maker Protocol. Through an open and documented process, the goal ` +
  `is to collect as much community feedback as possible and reach the bro` +
  `adest possible consensus on how the Maker Protocol should evolve. A pr` +
  `oposal clearly defines how and why Maker Governance or the Maker Proto` +
  `col should be changed and ensures that this improvement is introduced ` +
  `in a responsible way, respecting the highest quality, security and com` +
  `munity standards.\n-   **DIP${dipNumber_1}:** The genesis DIP defining the DIPs fra` +
  `mework. This DIP defines all of the processes that are required for th` +
  `e implementation of future DIPs. \n-   **DIP Sets:** A DIP set is a gr` +
  `oup of several DIPs that are interdependent, in which without the enti` +
  `re set of DIPs existing, one or more DIPs in the Set become inconsiste` +
  `nt, invalid or nonsensical. The intention is for DIP sets to together ` +
  `describe a single complex behaviour in such a way that allows each ind` +
  `ividual DIP to be written following the principle of Specificity but w` +
  `ork together as a cohesive modular whole.\n-   **DIP Types:** DIPs are` +
  ` separated into a number of types, and each type has its own list of M` +
  `IPs and processes.\n-   **Process DIP:** Process DIPs are used to crea` +
  `te and define a specific recurring process that the Maker Protocol or ` +
  `Governance will employ.\n-   **Subproposals (SPs):** A subproposal is ` +
  `an instance of a sub-process that has been defined by a specific DIP. ` +
  `Subproposals are named in the following format: DIP${dipNumber_1}-SP1 (where DIP${dipNumber_1} i` +
  `s a Process DIP and DIP${dipNumber_1}-SP1 is a subproposal under that Process DIP) ` +
  ` \n-   **Minimum Feedback Period:** The minimum amount of time within ` +
  `which the community is able to give feedback in response to a proposed` +
  ` DIP.  \n-   **Minimum Frozen Period:** The minimum amount of time dur` +
  `ing which a DIP must remain unchanged (frozen) before it can be submit` +
  `ted for ratification/implementation.\n-   **Governance Facilitator(s):` +
  `** Governance Facilitators are tasked with ensuring the smooth operati` +
  `on of the governance process. This involves a wide range of activities` +
  `, anything from general administration to signals gathering to governa` +
  `nce scheduling.\n-  **DIP Editor(s):** Enforce the administrative and ` +
  `editorial aspects of the overall DIPs process and program. The expecta` +
  `tion is that the program will start out with an interim editor from th` +
  `e Maker Foundation and that others will join later.\n-   **Domain Team` +
  `s**: Domain Teams work for the DAO, are onboarded through governance a` +
  `nd are paid by the Protocol. Domain teams perform defined duties for t` +
  `he DAO, such as overseeing critical processes and mitigating risk. The` +
  `se teams consist of but are not limited to Risk, Oracles, Smart Contra` +
  `cts or Legal. \n    \n\n---\n### DIP${dipNumber_1}c2: Core Principles\n\n 1. **Spec` +
  `ificity:** A DIP needs to define and address a specific behaviour or s` +
  `ingle responsibility. DIPs with many different behaviours or responsib` +
  `ilities will not be allowed and must be split up into multiple DIPs.\n` +
  `\t - This mitigates the risk of having “fine print” or potential attac` +
  `ks hidden in large, complex DIPs.\n 2. **Completeness:** A DIP or DIP ` +
  `Set is complete if it has all the necessary or appropriate parts that ` +
  `cover a whole behaviour and avoids being only a specific part of a gre` +
  `ater whole.\n\t - This is important for both understandability, readab` +
  `ility and accessibility of DIPs.\n3.  **Avoid overlap:** Multiple DIPs` +
  ` should not implement the same type of behaviour independently. For in` +
  `stance, there should not be two separate but interchangeable ways to d` +
  `o collateral onboarding.\n\t- This way the primary and best-understood` +
  ` process for each particular behaviour will be fairly available to eve` +
  `ryone, without risking having a knowledge gap that makes it possible f` +
  `or some actors with better access to information to use different and ` +
  `potentially better processes\n4. **Clarity:** A DIP must not have equa` +
  `lly valid conflicting interpretations. DIP Authors and DIP Editors mus` +
  `t strive to reduce ambiguity. A DIP must be as clear and easy to under` +
  `stand as possible.\n\t- Any ambiguous DIPs are likely to cause content` +
  `ion or confusion in the future. Making everything as clear as possible` +
  ` also aids readability and helps to mitigate the risk of hidden attack` +
  `s.\n5. **Brevity:** A DIP must be as short as possible, including only` +
  ` that which is essential given the other core principles.\n\t- The sho` +
  `rter DIPs are the more likely participants in governance are to read t` +
  `hem in full. This also serves to reduce the surface area for hidden at` +
  `tacks.\n\t\n---\n\n### DIP${dipNumber_1}c3: The DIP Lifecycle\n\n**The DIP Lifecycl` +
  `e Flow and DIP Statuses**\n\n![dip_life_cycle](https://user-images.git` +
  `hubusercontent.com/32653033/79086728-19d93900-7d0b-11ea-8086-c255d9190` +
  `96c.png)\n\n\n**DIP Status Criteria**  \n\n**1. Conception:** The life` +
  `cycle of a DIP begins when the DIP proposal is posted on the Maker for` +
  `um. However, in order for a DIP to move to the next stage, it needs to` +
  ` satisfy the transition criteria (1) described below:\n\n-   Submitted` +
  ` to the DIPs Discourse Forum.\n-   Submitted to the DIPs Github reposi` +
  `tory (with a Pull Request created by the DIP Author or DIP Editor).\n-` +
  `   The format must follow the appropriate DIP Template for its type.\n` +
  `-   DIPs must be original or replacement versions of older DIPs (No re` +
  `peats allowed).\n\n**2. Approved by DIP Editor(s):** This phase of a M` +
  `IP’s life cycle is when the DIP Editor(s) confirms that the proposed M` +
  `IP follows the correct structure and editorial criteria defined in the` +
  ` DIP template. If the criteria is not met, the DIP Editor(s) will prov` +
  `ide an explanation to the DIP Author as to why and allow them to make ` +
  `the appropriate changes before reconsideration. If the criteria have b` +
  `een met, the DIP Editor(s) performs the following actions:\n    \n-   ` +
  `The DIP is approved by a DIP Editor(s) and is assigned a formal DIP nu` +
  `mber.\n-   The PR is merged in by a DIP Editor(s).\n\n**3. Request for` +
  ` Comments (RFC):** This phase is when a DIP goes through a formal revi` +
  `ew period, including feedback from the community, further drafting and` +
  ` additions. The timeline for the RFC phase is defined by its Feedback ` +
  `Period and Frozen Period. In order to move to the next phase, it needs` +
  ` to satisfy the transition criteria listed below:\n     \n - DIP Autho` +
  `r finalizes changes of the DIP, based on community feedback.\n - DIPs ` +
  `have a Feedback Period of 3 months. The RFC phase lasts at least 3 mon` +
  `ths before the DIP can move to the next phase. \n - DIPs have a Frozen` +
  ` Period of 1 month. DIPs must not have had any changes for the last 1 ` +
  `month before they move to the next phase.\n\n**4. Fulfilled Feedback P` +
  `eriod Requirements:** This status is given once the DIP has fulfilled ` +
  `the defined Feedback Period and Frozen Period. After the DIP has waite` +
  `d out its Feedback Period and Frozen Period, it’s ready for Formal Sub` +
  `mission. Note that the Feedback Period and Frozen Period can overlap.` +
  `\n\n**5. Formal Submission (FS):** This phase is when DIP Authors subm` +
  `it their complete DIP(s) to the Governance cycle by posting it to the ` +
  `formal submission forum category within the formal submission window o` +
  `f a governance cycle.\n    - A DIP can be re-submitted to the formal s` +
  `ubmission process a maximum of 2 additional times (3 total), without h` +
  `aving to go through phase 1- 4 again, if it failed to pass due to legi` +
  `timate external reasons (e.g. got bundled in a governance poll or exec` +
  `utive vote with a controversial proposal - subject to the governance f` +
  `acilitators judgement).\n  \n**6. Approved by the Governance Facilitat` +
  `or(s):** This phase is when the DIP must be formally approved by the G` +
  `overnance Facilitators.   \n\n- Once approved by the Governance Facili` +
  `tator, the DIP will be included in the inclusion poll of the Governanc` +
  `e cycle.\n- If the DIP is not approved by the Governance Facilitator, ` +
  `it may be reconsidered at a later date to enter the Governance cycle. ` +
  `\n    \n**7. Governance Cycle:** This phase is when MKR holders vote o` +
  `n whether to include the DIP in the governance poll, ultimately determ` +
  `ining whether or not the DIP can formally enter the governance cycle.` +
  `\n- Once approved for the governance poll, MKR holders determine wheth` +
  `er to accept or reject the package of proposals in the governance poll` +
  ` and finally to ratify the result in the executive vote.  \n\n**8. Exe` +
  `cutive Vote:** This phase is when the DIP becomes officially ratified ` +
  `or not. Determined by MKR holders, the executive vote ultimately accep` +
  `ts or rejects the DIP.  \n\n**9. Accepted/Rejected:** The Executive vo` +
  `te results in either acceptance or rejection of the DIP. If passed, th` +
  `e DIP is officially accepted and is given the accepted status. If the ` +
  `executive vote fails to pass before expiring, the DIP is rejected.\n- ` +
  `As described in phase 5, a rejected DIP, can be resubmitted, and in so` +
  `me cases (if it was rejected for provable extraneous explanation) may ` +
  `be allowed to enter the next Governance cycle immediately.  \n      \n` +
  `\n**Other DIP Statuses:**  \n     \n\n**Withdrawn:** when a DIP Author` +
  ` withdraws their DIP proposal, such as when:\n\n - A DIP may be withdr` +
  `awn at any point before it enters the Governance cycle. \n - Note that` +
  ` a withdrawn proposal can be taken over from the original Author with ` +
  `a simple transition facilitated by a DIP Editor(s) and the respective ` +
  `parties. If the original DIP Author ceases to be available, the DIP Ed` +
  `itor(s) may proceed with the transfer of Authors.\n\n**Deferred:** whe` +
  `n a proposal has been deemed as not ready or not a priority but can be` +
  ` re-proposed at a later date.\n-   Request for Comments (RFC) - Forum ` +
  `poll/signal request rejects a DIP Proposal.\n\n**Obsolete:** when a pr` +
  `oposal is no longer used or is out of date, such as:\n    \n-   A DIP ` +
  `is replaced with a new proposal.\n-   A DIP has been deferred for over` +
  ` 6 months.\n-   A DIP Author has abandoned the proposal and no person ` +
  `has communicated willingness to take over DIP Author responsibility.\n` +
  `-   A DIP has been replaced by a newer, more updated DIP Proposal.\n- ` +
  `  A DIP no longer makes sense to keep in consideration.\n    \n  \n**M` +
  `IP Status Change Process:**\n    \n\nA status change for a DIP is requ` +
  `ested by the DIP Author and will be reviewed by the DIP Editor(s) to s` +
  `ee if it meets the status criteria of the requested status change. If ` +
  `it does, the Editor(s) will change the status of the DIP and the Autho` +
  `r may proceed with the next stage of the process. If it does not, the ` +
  `DIP Editor(s) will revert with highlighted issues, and the Author must` +
  ` fix the highlighted issues before requesting another status change.\n` +
  `    \n---\n### DIP${dipNumber_1}c4: DIP Components and DIP Component Types\n\n\n**M` +
  `IP Components**\n\n- When necessary, DIPs can have multiple components` +
  ` if it needs to contain multiple units of logic to satisfy completenes` +
  `s. A DIP can also have only a single component.\n- DIP components are ` +
  `categorized by types, depending on what kind of logic they contain. MI` +
  `P components are named by their parent DIP. The abbreviation conventio` +
  `n DIPXcY is used to refer to these components (as seen in this documen` +
  `t).\n- A DIP component has one type or no types. \n\n\n**Component Typ` +
  `es**\n    \n-   **Process DIP Component**  \n      \n    **Summary:** ` +
  `The purpose of a Process DIP component is to shape a specific process ` +
  `flow for the Maker community to adopt and standardize with respect to ` +
  `how governance operates. This DIP component type helps streamline spec` +
  `ific processes in a transparent, open and traceable manner. A Process ` +
  `DIP will provide a publicly documented scope of a proposed process fra` +
  `mework as well as a detailed description of the subproposal structure.` +
  `  \n      \n    **Special Template:** N/A  \n      \n    **Important N` +
  `otes:**  \n\n\t-   A Process DIP component must define the Feedback Pe` +
  `riod and Frozen Period for its sub proposals.\n\t-   Sub proposals of ` +
  `Process DIP components with additional DIP Component types inherit the` +
  ` same types.  \n      \n    \n\n-   **Subproposals**  \n      \n    **` +
  `Summary:** A subproposal is an expedited process that is defined withi` +
  `n a DIP to serve as a definition of how to run a given process within ` +
  `the DIPs framework. \n\n- Subproposals require a template, a feedback ` +
  `period and a frozen period and are submitted using that template. Subp` +
  `roposals go through the DIPs process in the same way that full DIPs do` +
  `. The template, feedback period and frozen period for a set of subprop` +
  `osals are defined using a DIP component known as a Process component. ` +
  `Any DIP containing a Process Component gains the Process type.\n- The ` +
  `subproposal naming convention is DIPXcY-SPZ where Y is the Process Com` +
  `ponent that contains the subproposal template and X is the DIP contain` +
  `ing that component. This is important in order to delineate between di` +
  `fferent types of subproposal defined in the same DIP under different P` +
  `rocess components.\n   \n**Special Template:** N/A  \n  \n---\n\n### M` +
  `IP${dipNumber_1}c5: DIP Replacement Process\n\nA DIP can define one or more replace` +
  `ment targets in its preamble. If the DIP is given the accepted status,` +
  ` the replacement target(s) DIPs then receive the Obsolete status and e` +
  `ffectively become inactive. The replaced DIP will in its DIP document ` +
  `contain the number of the DIP that replaced it, and other DIPs that de` +
  `pend on the replaced DIP, will instead interact with the new DIP.\n\nD` +
  `ue to the fact that the dependencies carry over, a DIP with defined re` +
  `placement targets must, in order to be valid, strictly adhere to depen` +
  `dency requirements and interface correctly with DIPs that depend on th` +
  `e replaced DIP, and thus after the replacement with the new DIP.  \n\n` +
  `---\n\n### DIP${dipNumber_1}c6: Supporting Materials\n\nDIPs can optionally refer t` +
  `o external materials. External materials must be added to the DIPs git` +
  `hub in the same folder as the DIP which references them.\n\nExternally` +
  ` referenced materials are not DIP content, and are not ratified when a` +
  ` DIP becomes Accepted unless it is explicitly stated otherwise in a MI` +
  `P Component specification.\n\n---\n\n### DIP${dipNumber_1}c7: DIP Templates\n\n**Ge` +
  `neral DIP Template**\n- The General DIP Template should be used for MI` +
  `Ps whenever a more specific ratified template is not more appropriate.` +
  ` \n- The General DIP Template is located at **[General-DIP-Template.md` +
  `](General-DIP-Template.md)**. This template is considered ratified onc` +
  `e this DIP moves to Accepted status.\n\n**Technical DIP Template**\n- ` +
  `The Technical DIP Template should be used for DIPs whenever a DIP prop` +
  `oses changes to the smart contract code within the Maker Protocol.\n- ` +
  `The Technical DIP Template is located at **[Technical-DIP-Template.md]` +
  `(Technical-DIP-Template.md)**. This template is considered ratified on` +
  `ce this DIP moves to Accepted status.\n---    \n\n### DIP${dipNumber_1}c8: DIP${dipNumber_1} Dom` +
  `ain Role Dependencies\n\n\nThe DIPs Framework depends on these types o` +
  `f Domain Roles:\n-   **DIP Editor(s):** Enforces the administrative an` +
  `d editorial aspects of the overall DIPs process and program. The expec` +
  `tation is that the program will start out with an interim editor from ` +
  `the Maker Foundation and that others will join later.\n-   **Specific ` +
  `authority of the DIP Editor(s) in DIP${dipNumber_1} processes:**\n\t-   The DIP Edi` +
  `tor(s) controls phase 2 of the DIP lifecycle and can assign DIP number` +
  `s\n\t-   The DIP Editor(s) is an admin on the DIPs Github repository\n` +
  `\t-   The DIP Editor(s) is a moderator on the DIPs Discourse forum\n\t` +
  `-   The DIP Editor(s) is responsible for updating the status of DIPs, ` +
  `as described in DIP${dipNumber_1}c4 “The DIP Lifecycle”.\n-   **Governance Facilita` +
  `tor:** Operates voting frontends, runs governance meetings and accepts` +
  ` DIPs that are ready to be included in the Governance Cycle and thus, ` +
  `voted on.\n-   **Specific authority of the Governance Facilitator in M` +
  `IP${dipNumber_1} processes:**\n\n\t-   Consensus from all governance facilitators c` +
  `ontrols phase 6 of the DIP lifecycle, which allows them to, with conse` +
  `nsus, add valid DIPs to the inclusion poll of the next governance cycl` +
  `e, moving them from phase 5 (formal submission) to phase 7 (governance` +
  ` cycle).\n\nPersonnel may be added to these roles using a DIP${dipNumber_1}c10 sub-` +
  `proposal.\nPersonnel may be removed from these roles using a DIP${dipNumber_1}c11 s` +
  `ub-proposal.\n\n---\n### DIP${dipNumber_1}c9: Core Personnel Role List \n\nThis lis` +
  `t can be amended through the core personnel onboarding (DIP${dipNumber_1}c12) and ` +
  `offboarding components (DIP${dipNumber_1}c13) of DIP${dipNumber_1}.\n\nEntries into this list sh` +
  `ould follow the following template:\n\n${"```"}\n- Person Name: The name of` +
  ` the person in the core role.\n\t- Sub-proposal Number (DIP${dipNumber_1}c12-SP): #` +
  `\n\t- Core Role: The core role in which the person operates.\n\t- Date` +
  ` Added: <date in (yyyy-mm-dd) format>\n${"```"}\n\n**Active Core Personnel ` +
  `List:**\n\n1. **Governance Facilitators:** \n\n- **Person Name:** Rich` +
  `ard Brown\n    - **Sub-proposal Number (DIP${dipNumber_1}c12-SP):** N/A (Governance` +
  ` Facilitator was ratified prior to the DIPs process. Reference: [Manda` +
  `te: Interim Governance Facilitators](https://forum.makerdao.com/t/mand` +
  `ate-interim-governance-facilitators/264))\n    - **Core Role:** Govern` +
  `ance Facilitator\n    - **Date Added:** 2019-09-09 ([Poll: Ratify the ` +
  `Interim Governance Facilitator Mandate](https://vote.makerdao.com/poll` +
  `ing-proposal/qmvh4z3l5ymqgtfs6tifq3jpjx5mxgdfnjy6alewnwwvba))\n\n- **P` +
  `erson Name:** LongForWisdom\n    - **Sub-proposal Number (DIP${dipNumber_1}c12-SP):` +
  `** 2\n    - **Core Role:** Governance Facilitator\n    - **Date Added:` +
  `** 2020-05-28 [Ratification Vote: Officially Ratify the DIP${dipNumber_1}c12-SP2 Su` +
  `bproposal for Onboarding a Second Governance Facilitator](https://mkrg` +
  `ov.science/executive/0x9713187b6d7c8d54ac041efdbac13d52c2120fb9)\n\n2.` +
  ` **DIP Editors:**\n\n-  **Person Name:** Charles St.Louis\n\t- **Sub-p` +
  `roposal Number (DIP${dipNumber_1}c12-SP):** 1\n\t- **Core Role:** DIP Editor\n\t- *` +
  `*Date Added:** 2020-05-02 ([Ratification Vote](https://vote.makerdao.c` +
  `om/executive-proposal/lower-usdc-sf-add-wbtc-ratify-the-initial-dips-a` +
  `nd-subproposals))\n\n---\n\n### DIP${dipNumber_1}c10: DIP Editor Role  \n\n\n**Resp` +
  `onsibilities**\n\nThe DIP Editor enforces the administrative and edito` +
  `rial aspects of the overall DIPs process and framework. This includes:` +
  `\n-   Maintain and manage dips.makerdao.com.\n-   Provide feedback and` +
  ` have discussions in the DIP section of forum.makerdao.com (ex: helpin` +
  `g vet proposal ideas).\n-   DIPs processing.\n-   Management and organ` +
  `ization of DIP and Subproposal Preambles. \n-   Onboard and vet new MI` +
  `P Editors.\n-   Enforcing the proper DIPs process with responsibilitie` +
  `s such as:\n    -   Confirm that the title accurately describes the co` +
  `ntent of the proposal.\n    -   Confirm there is a (real) dedicated au` +
  `thor, coordinator, funder and/or sponsor, etc. of the DIP.\n    -   As` +
  `sign proposed DIP's formal number labels.\n    -   Change DIP statuses` +
  `.\n    -   Correct DIP category placement.\n    -   Correspond with MI` +
  `P authors/coordinators.\n    -   Review the DIP for obvious defects in` +
  ` the language (format, completeness, spelling, grammar, sentence struc` +
  `ture) and that it follows the style guide (template). DIP Editors are ` +
  `allowed to correct problems themselves, but are not required to do so ` +
  `and can send comments to authors to improve it themselves.\n    -   Wo` +
  `rk and communicate with Governance Facilitators on coordinating govern` +
  `ance and executive votes in relation to DIPs and the governance cycle.` +
  `\n\n    \n\n**Selection Criteria**\n    \nThe following criteria shoul` +
  `d be used when selecting a DIP Editor:\n\n-   A complete understanding` +
  ` of the DIPs Framework\n-   Knowledge share will occur when onboarded ` +
  `but the candidate must be very familiar with the framework and how oth` +
  `er improvement proposal frameworks operate.\n-   Required to be a comm` +
  `unity member for some time. This can be shown through various proof of` +
  ` participation methods, such as:\n    -   Past forum posts\n    -   At` +
  `tendance of community and governance calls\n    -   Articles written a` +
  `bout Maker or Dai\n-   Familiarity with the technical inner workings o` +
  `f the Maker Protocol (bonus)\n-   Experience with Github\n    -   Merg` +
  `ing, editing, closing Pull Requests\n    -   Addressing issues\n    - ` +
  `  Adding tags / labels\n-   Experience with the Markdown language\n   ` +
  ` -   DIPs will be written in Markdown, so editors will need to be fami` +
  `liar with the language. \n\n**Addition**\n\nOnce a person has been onb` +
  `oarded to the DIP Editor role, they will be added to Github and subscr` +
  `ibed to watching the DIP repository. They will also become a moderator` +
  ` in the DIPs Rocket.Chat Channel and the DIPs Forum. Much of the corre` +
  `spondence regarding DIPs will be handled through GitHub as well in the` +
  ` MakerDAO forums.\n\n\n**Removal**\n\nA DIP Editor should be considere` +
  `d for removal if they are:\n    \n-   Not adequately performing their ` +
  `defined duties\n-   Absent from their duties for a prolonged period\n-` +
  `   Displaying biased or malicious behaviour\n-   Expressing unwillingn` +
  `ess to continue in their role.\n\nThe removal process begins once the ` +
  `community has agreed on the reasoning for removal. This process must b` +
  `e communicated publicly via the forums in order to provide complete tr` +
  `ansparency. **The DIP Editor will then be removed from the following c` +
  `hannels:**\n\n-   Github\n-   RocketChat\n-   Forums\n\n---\n\n### DIP` +
  `${dipNumber_1}c11: Governance Facilitator Role\n\n**Responsibilities**\n\nThe Gover` +
  `nance Facilitator's responsibilities are defined as the following:\n\n` +
  `Core Responsibilities\n- Responsible for ensuring the health and integ` +
  `rity of communication channels that are used for communication within ` +
  `MakerDAO. These tasks include moderation duties, establishing processe` +
  `s and social norms, and defending the channels from trolling and Sybil` +
  ` attacks.\n- Required to remain neutral and objective on issues outsid` +
  `e the governance domain and focus on policy, procedure and facilitatio` +
  `n.\n- Required to schedule, run and moderate weekly governance and ris` +
  `k meetings from a position of neutrality.\n- Required to manage and r` +
  `un governance processes as directed by relevant Accepted DIPs or DIP ` +
  `sets. \n- Required to create on-chain polls on the ‘official’ voting ` +
  `frontend as directed by governance processes defined in relevant Acce` +
  `pted DIPs or DIP sets.\n- Should aim to foster a culture of openness,` +
  ` receptiveness and reasoned discussion within the community.\n- Shoul` +
  `d work with the community to operate an emergency voting process to d` +
  `efend the system in the event of an emergency.\n- Should aim to onboa` +
  `rd and maintain at least three Governance Facilitators at all times w` +
  `hile prioritising candidates from unrepresented geographic regions.\n` +
  `\n\nEncouraging Participation\n- Should work to maintain and encourag` +
  `e healthy debate, in accordance with the guidelines outlined in the S` +
  `cientific Governance and Risk Framework and the Core Foundation Princ` +
  `ipals.\n- Should ensure that the upcoming governance schedule is well` +
  ` communicated to all stakeholders at least a week in advance.\n- Shou` +
  `ld aim to promote and increase engagement by stakeholders in the gove` +
  `rnance process. \n- Should ensure that new members of the community u` +
  `nderstand the general level of decorum and civility expected by the g` +
  `roup, that they have the resources they need to get onboarded quickly` +
  `.\n\nImproving Efficiency\n\n- Should ensure that once debate reaches` +
  ` its natural end that appropriate consensus gathering methods take pl` +
  `ace.\n- Should support and facilitate communications between the othe` +
  `r mandated actors in the Maker Protocol.\n- Should look for opportuni` +
  `ties to streamline the governance process without sacrificing its int` +
  `egrity. \n\nCohesion and Morale\n- Responsible for raising community ` +
  `governance issues to the Maker Foundation or the third-party ecosyste` +
  `m and ensuring appropriate follow up for the community.\n- Should hel` +
  `p to build and maintain morale and engagement among members of the go` +
  `vernance community.\n- Should encourage the community to come to cons` +
  `ensus over the least objectionable option(s) rather than treating dec` +
  `ision-making as a competition where a subset of the community must en` +
  `d up disappointed in the outcome. \n- Should work to bring the govern` +
  `ance community together on divisive topics and to prevent political p` +
  `olarisation and demagoguery. \n\n**Selection Criteria**\n    \nThe fo` +
  `llowing criteria should be used when evaluating an individual for the` +
  ` role of Governance Facilitator:\n\n- Should have a complete understa` +
  `nding of the DIPs Framework and content, especially in relation to co` +
  `re governance DIPs.\n- Required to be a community member for some tim` +
  `e. This can be shown through various proof of participation methods, ` +
  `such as:\n\t- Past forum posts\n\t- Attendance of community and gover` +
  `nance calls\n\t- Input into issues of governance in any communication` +
  `s venue.\n- Knowledge share will occur when onboarded but the candida` +
  `te must be familiar with the roles and responsibilities of Governance` +
  ` Facilitators.\n- Should have familiarity with the technical inner wo` +
  `rkings of the Maker Protocol (bonus)\n- Must have experience engaging` +
  ` with different stakeholders in the community in all the different ve` +
  `nues the community uses for communications including chat rooms, foru` +
  `ms and video conference calls.\n- Should be confident in expressing t` +
  `hemselves in each of the different venues the community uses for comm` +
  `unications including chat rooms, forums and video conference calls.\n` +
  `- Should have an interest in governance mechanisms used presently and` +
  ` historically across the world.\n\n**Removal**\n\nA Governance Facili` +
  `tator should be considered for removal if they are:\n-   Not adequate` +
  `ly performing their defined duties\n-   Absent from their duties for ` +
  `a prolonged period\n-   Displaying biased or malicious behaviour\n-  ` +
  ` Expressing unwillingness to continue in their role.\n    \nThe remov` +
  `al process begins once the community has agreed on the reasoning for ` +
  `removal. This process must be communicated publicly via the forums in` +
  ` order to provide complete transparency. **The Governance Facilitator` +
  ` will then be removed from the following channels:**\n-   Github\n-  ` +
  ` RocketChat\n-   Forums\n\n---\n\n### DIP${dipNumber_1}c12: Core Personnel Onboard` +
  `ing\n\nDIP${dipNumber_1}c12 is a Process DIP component that allows the onboarding ` +
  `of core personnel using a subproposal. DIP${dipNumber_1}c12 subproposals have the ` +
  `following parameters:\n-   **Feedback Period**: 3 months\n-   **Froze` +
  `n Period**: 1 month\n\nDIP${dipNumber_1}c12 subproposals must use the template loc` +
  `ated at  **[DIP${dipNumber_1}c12-Subproposal-Template.md](DIP${dipNumber_1}c12-Subproposal-Temp` +
  `late.md)**. This template is considered ratified once this DIP moves ` +
  `to Accepted status.\n\n---\n\n### DIP${dipNumber_1}c13: Core Personnel Offboarding` +
  `\n\nDIP${dipNumber_1}c13 is a Process DIP component that allows the removal of cor` +
  `e personnel using a subproposal. DIP${dipNumber_1}c13 subproposals have the follow` +
  `ing parameters:\n\n-   **Feedback Period**: 0 days\n-   **Frozen Peri` +
  `od**: 0 days\n\nDIP${dipNumber_1}c13 subproposals must use the template located at` +
  `  **[DIP${dipNumber_1}c13-Subproposal-Template.md](DIP${dipNumber_1}c13-Subproposal-Template.md` +
  `)**. This template is considered ratified once this DIP moves to Acce` +
  `pted status.\n\n---`;

// DIPsController (integration tests) and ParseDIPsService (unit tests) and DIPsService (unit tests)
export const dipData = {
  hash: faker.lorem.paragraph(),
  file:
    `# DIP${dipNumber_1}: ${titleMock}\n` +
    `\n` +
    `## Preamble\n` +
    `${"```"}\n` +
    `DIP#: ${dipNumber_1}\n` +
    `Title: ${titleMock}\n` +
    `Author(s): ${authorMock[0]}, ${authorMock[1]}\n` +
    `Forum URL: ${forumLinkMock}\n` +
    `Tags: ${tagsMock}` +
    `Contributors: ${contributorsMock}\n` +
    `Type: ${typesMock}\n` +
    `Ratification Poll URL: ${votingPortalLinkMock}\n` +
    `Status: ${statusMock} \n` +
    `Date Proposed: ${dateProposedMock}\n` +
    `Date Ratified: ${dateRatifiedMock}\n` +
    `Dependencies: ${dependenciesMock}\n` +
    `Replaces: ${replacesMock}\n` +
    `${"```"}\n` +
    `## References\n` +
    `**[General-DIP-Template.md](General-DIP-Template.md)**  \n` +
    `**[Technical-DIP-Template.md](Technical-DIP-Template.md)**  \n` +
    `**[DIP${dipNumber_1}c12-Subproposal-Template.md](DIP${dipNumber_1}c12-Subproposal-Template.md)**  \n` +
    `**[DIP${dipNumber_1}c13-Subproposal-Template.md](DIP${dipNumber_1}c13-Subproposal-Template.md)**  \n` +
    `\n` +
    `## Sentence Summary\n` +
    `\n` +
    `${sentenceSummary}\n` +
    `\n` +
    `## Paragraph Summary\n` +
    `\n` +
    `${paragraphSummaryMock}\n` +
    `\n` +
    `## Component Summary ${dipNumber_1}\n` +
    `\n` +
    `**DIP${dipNumber_1}c1: Definitions of the Maker Improvement Proposal Framework**  \n` +
    `Defines several concepts that are important for understanding the DIPs process.\n` +
    `\n` +
    `**DIP${dipNumber_1}c2: Core Principles**  \n` +
    `Discusses some core principles that all DIPs should aim to follow.\n` +
    `\n` +
    `**DIP${dipNumber_1}c3: The DIP Lifecycle**  \n` +
    `Lays out how a DIP is created and moves through the process to become Accepted or Rejected.\n` +
    `\n` +
    `**DIP${dipNumber_1}c4: DIP Components and DIP Component Types**  \n` +
    `Discusses the use of components to compartmentalize and organise DIPs\n` +
    `\n` +
    `**DIP${dipNumber_1}c5: DIP Replacement Process**  \n` +
    `Discusses how DIPs can be replaced and the steps to be taken to maintain dependencies.\n` +
    `\n` +
    `**DIP${dipNumber_1}c6: Supporting Materials**\n` +
    `A component that defines how to include external materials inside DIPs.\n` +
    `\n` +
    `**DIP${dipNumber_1}c7: DIP Templates**  \n` +
    `Defines the DIP templates for both General and Technical DIPs.\n` +
    `\n` +
    `**DIP${dipNumber_1}c8: DIP${dipNumber_1} Domain Role Dependencies**  \n` +
    `Defines the core roles that the DIPs process requires to operate successfully.\n` +
    `\n` +
    `**DIP${dipNumber_1}c9: Core Personnel Role List**  \n` +
    `List of of personnel currently occupying core roles.\n` +
    `\n` +
    `**DIP${dipNumber_1}c10: DIP Editor Role**  \n` +
    `A component that defines the responsibilities, criteria and grounds for removal of the DIP Editor role.\n` +
    `\n` +
    `**DIP${dipNumber_1}c11: Governance Facilitator Role**  \n` +
    `A component that defines the responsibilities, criteria and grounds for removal of the Governance Facilitator role.\n` +
    `\n` +
    `**DIP${dipNumber_1}c12: Core Personnel Onboarding**  \n` +
    `A process component that defines the process to add personnel to the DIP Editor or Governance Facilitator roles.\n` +
    `\n` +
    `**DIP${dipNumber_1}c13: Core Personnel Offboarding**  \n` +
    `A process component that defines the process to remove personnel from the DIP Editor or Governance Facilitator roles.\n` +
    `\n` +
    `\n` +
    `## Motivation\n` +
    `\n` +
    `MakerDAO is evolving into an organization that is trustless, fully decentralized, open-sourced, and self-sustainable. In order to further enable this gradual evolution while maintaining governance functionality both during this process and after the dissolution of the Maker Foundation, Maker will be governed using Maker Improvement Proposals (DIPs).\n` +
    `\n` +
    `The purpose of the DIPs Framework is to open up the ability to improve Maker Governance and the Maker Protocol to anyone in the community.\n` +
    `\n` +
    `By empowering the participation of the community and other stakeholders to have a standard approach to proposing improvements, specifications, or process and state changes, the goal is to enable organic growth that will in turn bring MakerDAO closer to self-sustainability.\n` +
    `\n` +
    `In order for DIPs to be functional they need to comply with a basic standard outlining their internal structure and external dependencies. This standard is DIPs described in DIP${dipNumber_1}, the Maker Improvement Proposal Framework.\n` +
    `\n` +
    `\n` +
    `## Specification / Proposal Details\n` +
    `\n` +
    `### DIP${dipNumber_1}c1: Definitions of the Maker Improvement Proposal Framework\n` +
    `\n` +
    `- **Maker Improvement Proposals (DIPs):** are the preferred mechanism for improving Maker Governance and the Maker Protocol. Through an open and documented process, the goal is to collect as much community feedback as possible and reach the broadest possible consensus on how the Maker Protocol should evolve. A proposal clearly defines how and why Maker Governance or the Maker Protocol should be changed and ensures that this improvement is introduced in a responsible way, respecting the highest quality, security and community standards.\n` +
    `-   **DIP${dipNumber_1}:** The genesis DIP defining the DIPs framework. This DIP defines all of the processes that are required for the implementation of future DIPs. \n` +
    `-   **DIP Sets:** A DIP set is a group of several DIPs that are interdependent, in which without the entire set of DIPs existing, one or more DIPs in the Set become inconsistent, invalid or nonsensical. The intention is for DIP sets to together describe a single complex behaviour in such a way that allows each individual DIP to be written following the principle of Specificity but work together as a cohesive modular whole.\n` +
    `-   **DIP Types:** DIPs are separated into a number of types, and each type has its own list of DIPs and processes.\n` +
    `-   **Process DIP:** Process DIPs are used to create and define a specific recurring process that the Maker Protocol or Governance will employ.\n` +
    `-   **Subproposals (SPs):** A subproposal is an instance of a sub-process that has been defined by a specific DIP. Subproposals are named in the following format: DIP${dipNumber_1}-SP1 (where DIP${dipNumber_1} is a Process DIP and DIP${dipNumber_1}-SP1 is a subproposal under that Process DIP)  \n` +
    `-   **Minimum Feedback Period:** The minimum amount of time within which the community is able to give feedback in response to a proposed DIP.  \n` +
    `-   **Minimum Frozen Period:** The minimum amount of time during which a DIP must remain unchanged (frozen) before it can be submitted for ratification/implementation.\n` +
    `-   **Governance Facilitator(s):** Governance Facilitators are tasked with ensuring the smooth operation of the governance process. This involves a wide range of activities, anything from general administration to signals gathering to governance scheduling.\n` +
    `-  **DIP Editor(s):** Enforce the administrative and editorial aspects of the overall DIPs process and program. The expectation is that the program will start out with an interim editor from the Maker Foundation and that others will join later.\n` +
    `-   **Domain Teams**: Domain Teams work for the DAO, are onboarded through governance and are paid by the Protocol. Domain teams perform defined duties for the DAO, such as overseeing critical processes and mitigating risk. These teams consist of but are not limited to Risk, Oracles, Smart Contracts or Legal. \n` +
    `    \n` +
    `\n` +
    `---\n` +
    `### DIP${dipNumber_1}c2: Core Principles\n` +
    `\n` +
    ` 1. **Specificity:** A DIP needs to define and address a specific behaviour or single responsibility. DIPs with many different behaviours or responsibilities will not be allowed and must be split up into multiple DIPs.\n` +
    `\t - This mitigates the risk of having “fine print” or potential attacks hidden in large, complex DIPs.\n` +
    ` 2. **Completeness:** A DIP or DIP Set is complete if it has all the necessary or appropriate parts that cover a whole behaviour and avoids being only a specific part of a greater whole.\n` +
    `\t - This is important for both understandability, readability and accessibility of DIPs.\n` +
    `3.  **Avoid overlap:** Multiple DIPs should not implement the same type of behaviour independently. For instance, there should not be two separate but interchangeable ways to do collateral onboarding.\n` +
    `\t- This way the primary and best-understood process for each particular behaviour will be fairly available to everyone, without risking having a knowledge gap that makes it possible for some actors with better access to information to use different and potentially better processes\n` +
    `4. **Clarity:** A DIP must not have equally valid conflicting interpretations. DIP Authors and DIP Editors must strive to reduce ambiguity. A DIP must be as clear and easy to understand as possible.\n` +
    `\t- Any ambiguous DIPs are likely to cause contention or confusion in the future. Making everything as clear as possible also aids readability and helps to mitigate the risk of hidden attacks.\n` +
    `5. **Brevity:** A DIP must be as short as possible, including only that which is essential given the other core principles.\n` +
    `\t- The shorter DIPs are the more likely participants in governance are to read them in full. This also serves to reduce the surface area for hidden attacks.\n` +
    `\t\n` +
    `---\n` +
    `\n` +
    `### DIP${dipNumber_1}c3: The DIP Lifecycle\n` +
    `\n` +
    `**The DIP Lifecycle Flow and DIP Statuses**\n` +
    `\n` +
    `![dip_life_cycle](https://user-images.githubusercontent.com/32653033/79086728-19d93900-7d0b-11ea-8086-c255d919096c.png)\n` +
    `\n` +
    `\n` +
    `**DIP Status Criteria**  \n` +
    `\n` +
    `**1. Conception:** The lifecycle of a DIP begins when the DIP proposal is posted on the Maker forum. However, in order for a DIP to move to the next stage, it needs to satisfy the transition criteria (1) described below:\n` +
    `\n` +
    `-   Submitted to the DIPs Discourse Forum.\n` +
    `-   Submitted to the DIPs Github repository (with a Pull Request created by the DIP Author or DIP Editor).\n` +
    `-   The format must follow the appropriate DIP Template for its type.\n` +
    `-   DIPs must be original or replacement versions of older DIPs (No repeats allowed).\n` +
    `\n` +
    `**2. Approved by DIP Editor(s):** This phase of a DIP’s life cycle is when the DIP Editor(s) confirms that the proposed DIP follows the correct structure and editorial criteria defined in the DIP template. If the criteria is not met, the DIP Editor(s) will provide an explanation to the DIP Author as to why and allow them to make the appropriate changes before reconsideration. If the criteria have been met, the DIP Editor(s) performs the following actions:\n` +
    `    \n` +
    `-   The DIP is approved by a DIP Editor(s) and is assigned a formal DIP number.\n` +
    `-   The PR is merged in by a DIP Editor(s).\n` +
    `\n` +
    `**3. Request for Comments (RFC):** This phase is when a DIP goes through a formal review period, including feedback from the community, further drafting and additions. The timeline for the RFC phase is defined by its Feedback Period and Frozen Period. In order to move to the next phase, it needs to satisfy the transition criteria listed below:\n` +
    `     \n` +
    ` - DIP Author finalizes changes of the DIP, based on community feedback.\n` +
    ` - DIPs have a Feedback Period of 3 months. The RFC phase lasts at least 3 months before the DIP can move to the next phase. \n` +
    ` - DIPs have a Frozen Period of 1 month. DIPs must not have had any changes for the last 1 month before they move to the next phase.\n` +
    `\n` +
    `**4. Fulfilled Feedback Period Requirements:** This status is given once the DIP has fulfilled the defined Feedback Period and Frozen Period. After the DIP has waited out its Feedback Period and Frozen Period, it’s ready for Formal Submission. Note that the Feedback Period and Frozen Period can overlap.\n` +
    `\n` +
    `**5. Formal Submission (FS):** This phase is when DIP Authors submit their complete DIP(s) to the Governance cycle by posting it to the formal submission forum category within the formal submission window of a governance cycle.\n` +
    `    - A DIP can be re-submitted to the formal submission process a maximum of 2 additional times (3 total), without having to go through phase 1- 4 again, if it failed to pass due to legitimate external reasons (e.g. got bundled in a governance poll or executive vote with a controversial proposal - subject to the governance facilitators judgement).\n` +
    `  \n` +
    `**6. Approved by the Governance Facilitator(s):** This phase is when the DIP must be formally approved by the Governance Facilitators.   \n` +
    `\n` +
    `- Once approved by the Governance Facilitator, the DIP will be included in the inclusion poll of the Governance cycle.\n` +
    `- If the DIP is not approved by the Governance Facilitator, it may be reconsidered at a later date to enter the Governance cycle. \n` +
    `    \n` +
    `**7. Governance Cycle:** This phase is when MKR holders vote on whether to include the DIP in the governance poll, ultimately determining whether or not the DIP can formally enter the governance cycle.\n` +
    `- Once approved for the governance poll, MKR holders determine whether to accept or reject the package of proposals in the governance poll and finally to ratify the result in the executive vote.  \n` +
    `\n` +
    `**8. Executive Vote:** This phase is when the DIP becomes officially ratified or not. Determined by MKR holders, the executive vote ultimately accepts or rejects the DIP.  \n` +
    `\n` +
    `**9. Accepted/Rejected:** The Executive vote results in either acceptance or rejection of the DIP. If passed, the DIP is officially accepted and is given the accepted status. If the executive vote fails to pass before expiring, the DIP is rejected.\n` +
    `- As described in phase 5, a rejected DIP, can be resubmitted, and in some cases (if it was rejected for provable extraneous explanation) may be allowed to enter the next Governance cycle immediately.  \n` +
    `      \n` +
    `\n` +
    `**Other DIP Statuses:**  \n` +
    `     \n` +
    `\n` +
    `**Withdrawn:** when a DIP Author withdraws their DIP proposal, such as when:\n` +
    `\n` +
    ` - A DIP may be withdrawn at any point before it enters the Governance cycle. \n` +
    ` - Note that a withdrawn proposal can be taken over from the original Author with a simple transition facilitated by a DIP Editor(s) and the respective parties. If the original DIP Author ceases to be available, the DIP Editor(s) may proceed with the transfer of Authors.\n` +
    `\n` +
    `**Deferred:** when a proposal has been deemed as not ready or not a priority but can be re-proposed at a later date.\n` +
    `-   Request for Comments (RFC) - Forum poll/signal request rejects a DIP Proposal.\n` +
    `\n` +
    `**Obsolete:** when a proposal is no longer used or is out of date, such as:\n` +
    `    \n` +
    `-   A DIP is replaced with a new proposal.\n` +
    `-   A DIP has been deferred for over 6 months.\n` +
    `-   A DIP Author has abandoned the proposal and no person has communicated willingness to take over DIP Author responsibility.\n` +
    `-   A DIP has been replaced by a newer, more updated DIP Proposal.\n` +
    `-   A DIP no longer makes sense to keep in consideration.\n` +
    `    \n` +
    `  \n` +
    `**DIP Status Change Process:**\n` +
    `    \n` +
    `\n` +
    `A status change for a DIP is requested by the DIP Author and will be reviewed by the DIP Editor(s) to see if it meets the status criteria of the requested status change. If it does, the Editor(s) will change the status of the DIP and the Author may proceed with the next stage of the process. If it does not, the DIP Editor(s) will revert with highlighted issues, and the Author must fix the highlighted issues before requesting another status change.\n` +
    `    \n` +
    `---\n` +
    `### DIP${dipNumber_1}c4: DIP Components and DIP Component Types\n` +
    `\n` +
    `\n` +
    `**DIP Components**\n` +
    `\n` +
    `- When necessary, DIPs can have multiple components if it needs to contain multiple units of logic to satisfy completeness. A DIP can also have only a single component.\n` +
    `- DIP components are categorized by types, depending on what kind of logic they contain. DIP components are named by their parent DIP. The abbreviation convention DIPXcY is used to refer to these components (as seen in this document).\n` +
    `- A DIP component has one type or no types. \n` +
    `\n` +
    `\n` +
    `**Component Types**\n` +
    `    \n` +
    `-   **Process DIP Component**  \n` +
    `      \n` +
    `    **Summary:** The purpose of a Process DIP component is to shape a specific process flow for the Maker community to adopt and standardize with respect to how governance operates. This DIP component type helps streamline specific processes in a transparent, open and traceable manner. A Process DIP will provide a publicly documented scope of a proposed process framework as well as a detailed description of the subproposal structure.  \n` +
    `      \n` +
    `    **Special Template:** N/A  \n` +
    `      \n` +
    `    **Important Notes:**  \n` +
    `\n` +
    `\t-   A Process DIP component must define the Feedback Period and Frozen Period for its sub proposals.\n` +
    `\t-   Sub proposals of Process DIP components with additional DIP Component types inherit the same types.  \n` +
    `      \n` +
    `    \n` +
    `\n` +
    `-   **Subproposals**  \n` +
    `      \n` +
    `    **Summary:** A subproposal is an expedited process that is defined within a DIP to serve as a definition of how to run a given process within the DIPs framework. \n` +
    `\n` +
    `- Subproposals require a template, a feedback period and a frozen period and are submitted using that template. Subproposals go through the DIPs process in the same way that full DIPs do. The template, feedback period and frozen period for a set of subproposals are defined using a DIP component known as a Process component. Any DIP containing a Process Component gains the Process type.\n` +
    `- The subproposal naming convention is DIPXcY-SPZ where Y is the Process Component that contains the subproposal template and X is the DIP containing that component. This is important in order to delineate between different types of subproposal defined in the same DIP under different Process components.\n` +
    `   \n` +
    `**Special Template:** N/A  \n` +
    `  \n` +
    `---\n` +
    `\n` +
    `### DIP${dipNumber_1}c5: DIP Replacement Process\n` +
    `\n` +
    `A DIP can define one or more replacement targets in its preamble. If the DIP is given the accepted status, the replacement target(s) DIPs then receive the Obsolete status and effectively become inactive. The replaced DIP will in its DIP document contain the number of the DIP that replaced it, and other DIPs that depend on the replaced DIP, will instead interact with the new DIP.\n` +
    `\n` +
    `Due to the fact that the dependencies carry over, a DIP with defined replacement targets must, in order to be valid, strictly adhere to dependency requirements and interface correctly with DIPs that depend on the replaced DIP, and thus after the replacement with the new DIP.  \n` +
    `\n` +
    `---\n` +
    `\n` +
    `### DIP${dipNumber_1}c6: Supporting Materials\n` +
    `\n` +
    `DIPs can optionally refer to external materials. External materials must be added to the DIPs github in the same folder as the DIP which references them.\n` +
    `\n` +
    `Externally referenced materials are not DIP content, and are not ratified when a DIP becomes Accepted unless it is explicitly stated otherwise in a DIP Component specification.\n` +
    `\n` +
    `---\n` +
    `\n` +
    `### DIP${dipNumber_1}c7: DIP Templates\n` +
    `\n` +
    `**General DIP Template**\n` +
    `- The General DIP Template should be used for DIPs whenever a more specific ratified template is not more appropriate. \n` +
    `- The General DIP Template is located at **[General-DIP-Template.md](General-DIP-Template.md)**. This template is considered ratified once this DIP moves to Accepted status.\n` +
    `\n` +
    `**Technical DIP Template**\n` +
    `- The Technical DIP Template should be used for DIPs whenever a DIP proposes changes to the smart contract code within the Maker Protocol.\n` +
    `- The Technical DIP Template is located at **[Technical-DIP-Template.md](Technical-DIP-Template.md)**. This template is considered ratified once this DIP moves to Accepted status.\n` +
    `---    \n` +
    `\n` +
    `### DIP${dipNumber_1}c8: DIP${dipNumber_1} Domain Role Dependencies\n` +
    `\n` +
    `\n` +
    `The DIPs Framework depends on these types of Domain Roles:\n` +
    `-   **DIP Editor(s):** Enforces the administrative and editorial aspects of the overall DIPs process and program. The expectation is that the program will start out with an interim editor from the Maker Foundation and that others will join later.\n` +
    `-   **Specific authority of the DIP Editor(s) in DIP${dipNumber_1} processes:**\n` +
    `\t-   The DIP Editor(s) controls phase 2 of the DIP lifecycle and can assign DIP numbers\n` +
    `\t-   The DIP Editor(s) is an admin on the DIPs Github repository\n` +
    `\t-   The DIP Editor(s) is a moderator on the DIPs Discourse forum\n` +
    `\t-   The DIP Editor(s) is responsible for updating the status of DIPs, as described in DIP${dipNumber_1}c4 “The DIP Lifecycle”.\n` +
    `-   **Governance Facilitator:** Operates voting frontends, runs governance meetings and accepts DIPs that are ready to be included in the Governance Cycle and thus, voted on.\n` +
    `-   **Specific authority of the Governance Facilitator in DIP${dipNumber_1} processes:**\n` +
    `\n` +
    `\t-   Consensus from all governance facilitators controls phase 6 of the DIP lifecycle, which allows them to, with consensus, add valid DIPs to the inclusion poll of the next governance cycle, moving them from phase 5 (formal submission) to phase 7 (governance cycle).\n` +
    `\n` +
    `Personnel may be added to these roles using a DIP${dipNumber_1}c10 sub-proposal.\n` +
    `Personnel may be removed from these roles using a DIP${dipNumber_1}c11 sub-proposal.\n` +
    `\n` +
    `---\n` +
    `### DIP${dipNumber_1}c9: Core Personnel Role List \n` +
    `\n` +
    `This list can be amended through the core personnel onboarding (DIP${dipNumber_1}c12) and offboarding components (DIP${dipNumber_1}c13) of DIP${dipNumber_1}.\n` +
    `\n` +
    `Entries into this list should follow the following template:\n` +
    `\n` +
    `${"```"}\n` +
    `- Person Name: The name of the person in the core role.\n` +
    `\t- Sub-proposal Number (DIP${dipNumber_1}c12-SP): #\n` +
    `\t- Core Role: The core role in which the person operates.\n` +
    `\t- Date Added: <date in (yyyy-mm-dd) format>\n` +
    `${"```"}\n` +
    `\n` +
    `**Active Core Personnel List:**\n` +
    `\n` +
    `1. **Governance Facilitators:** \n` +
    `\n` +
    `- **Person Name:** Richard Brown\n` +
    `    - **Sub-proposal Number (DIP${dipNumber_1}c12-SP):** N/A (Governance Facilitator was ratified prior to the DIPs process. Reference: [Mandate: Interim Governance Facilitators](https://forum.makerdao.com/t/mandate-interim-governance-facilitators/264))\n` +
    `    - **Core Role:** Governance Facilitator\n` +
    `    - **Date Added:** 2019-09-09 ([Poll: Ratify the Interim Governance Facilitator Mandate](https://vote.makerdao.com/polling-proposal/qmvh4z3l5ymqgtfs6tifq3jpjx5mxgdfnjy6alewnwwvba))\n` +
    `\n` +
    `- **Person Name:** LongForWisdom\n` +
    `    - **Sub-proposal Number (DIP${dipNumber_1}c12-SP):** 2\n` +
    `    - **Core Role:** Governance Facilitator\n` +
    `    - **Date Added:** 2020-05-28 [Ratification Vote: Officially Ratify the DIP${dipNumber_1}c12-SP2 Subproposal for Onboarding a Second Governance Facilitator](https://mkrgov.science/executive/0x9713187b6d7c8d54ac041efdbac13d52c2120fb9)\n` +
    `\n` +
    `2. **DIP Editors:**\n` +
    `\n` +
    `-  **Person Name:** Charles St.Louis\n` +
    `\t- **Sub-proposal Number (DIP${dipNumber_1}c12-SP):** 1\n` +
    `\t- **Core Role:** DIP Editor\n` +
    `\t- **Date Added:** 2020-05-02 ([Ratification Vote](https://vote.makerdao.com/executive-proposal/lower-usdc-sf-add-wbtc-ratify-the-initial-dips-and-subproposals))\n` +
    `\n` +
    `---\n` +
    `\n` +
    `### DIP${dipNumber_1}c10: DIP Editor Role  \n` +
    `\n` +
    `\n` +
    `**Responsibilities**\n` +
    `\n` +
    `The DIP Editor enforces the administrative and editorial aspects of the overall DIPs process and framework. This includes:\n` +
    `-   Maintain and manage dips.makerdao.com.\n` +
    `-   Provide feedback and have discussions in the DIP section of forum.makerdao.com (ex: helping vet proposal ideas).\n` +
    `-   DIPs processing.\n` +
    `-   Management and organization of DIP and Subproposal Preambles. \n` +
    `-   Onboard and vet new DIP Editors.\n` +
    `-   Enforcing the proper DIPs process with responsibilities such as:\n` +
    `    -   Confirm that the title accurately describes the content of the proposal.\n` +
    `    -   Confirm there is a (real) dedicated author, coordinator, funder and/or sponsor, etc. of the DIP.\n` +
    `    -   Assign proposed DIP's formal number labels.\n` +
    `    -   Change DIP statuses.\n` +
    `    -   Correct DIP category placement.\n` +
    `    -   Correspond with DIP authors/coordinators.\n` +
    `    -   Review the DIP for obvious defects in the language (format, completeness, spelling, grammar, sentence structure) and that it follows the style guide (template). DIP Editors are allowed to correct problems themselves, but are not required to do so and can send comments to authors to improve it themselves.\n` +
    `    -   Work and communicate with Governance Facilitators on coordinating governance and executive votes in relation to DIPs and the governance cycle.\n` +
    `\n` +
    `    \n` +
    `\n` +
    `**Selection Criteria**\n` +
    `    \n` +
    `The following criteria should be used when selecting a DIP Editor:\n` +
    `\n` +
    `-   A complete understanding of the DIPs Framework\n` +
    `-   Knowledge share will occur when onboarded but the candidate must be very familiar with the framework and how other improvement proposal frameworks operate.\n` +
    `-   Required to be a community member for some time. This can be shown through various proof of participation methods, such as:\n` +
    `    -   Past forum posts\n` +
    `    -   Attendance of community and governance calls\n` +
    `    -   Articles written about Maker or Dai\n` +
    `-   Familiarity with the technical inner workings of the Maker Protocol (bonus)\n` +
    `-   Experience with Github\n` +
    `    -   Merging, editing, closing Pull Requests\n` +
    `    -   Addressing issues\n` +
    `    -   Adding tags / labels\n` +
    `-   Experience with the Markdown language\n` +
    `    -   DIPs will be written in Markdown, so editors will need to be familiar with the language. \n` +
    `\n` +
    `**Addition**\n` +
    `\n` +
    `Once a person has been onboarded to the DIP Editor role, they will be added to Github and subscribed to watching the DIP repository. They will also become a moderator in the DIPs Rocket.Chat Channel and the DIPs Forum. Much of the correspondence regarding DIPs will be handled through GitHub as well in the MakerDAO forums.\n` +
    `\n` +
    `\n` +
    `**Removal**\n` +
    `\n` +
    `A DIP Editor should be considered for removal if they are:\n` +
    `    \n` +
    `-   Not adequately performing their defined duties\n` +
    `-   Absent from their duties for a prolonged period\n` +
    `-   Displaying biased or malicious behaviour\n` +
    `-   Expressing unwillingness to continue in their role.\n` +
    `\n` +
    `The removal process begins once the community has agreed on the reasoning for removal. This process must be communicated publicly via the forums in order to provide complete transparency. **The DIP Editor will then be removed from the following channels:**\n` +
    `\n` +
    `-   Github\n` +
    `-   RocketChat\n` +
    `-   Forums\n` +
    `\n` +
    `---\n` +
    `\n` +
    `### DIP${dipNumber_1}c11: Governance Facilitator Role\n` +
    `\n` +
    `**Responsibilities**\n` +
    `\n` +
    `The Governance Facilitator's responsibilities are defined as the following:\n` +
    `\n` +
    `Core Responsibilities\n` +
    `- Responsible for ensuring the health and integrity of communication channels that are used for communication within MakerDAO. These tasks include moderation duties, establishing processes and social norms, and defending the channels from trolling and Sybil attacks.\n` +
    `- Required to remain neutral and objective on issues outside the governance domain and focus on policy, procedure and facilitation.\n` +
    `- Required to schedule, run and moderate weekly governance and risk meetings from a position of neutrality.\n` +
    `- Required to manage and run governance processes as directed by relevant Accepted DIPs or DIP sets. \n` +
    `- Required to create on-chain polls on the ‘official’ voting frontend as directed by governance processes defined in relevant Accepted DIPs or DIP sets.\n` +
    `- Should aim to foster a culture of openness, receptiveness and reasoned discussion within the community.\n` +
    `- Should work with the community to operate an emergency voting process to defend the system in the event of an emergency.\n` +
    `- Should aim to onboard and maintain at least three Governance Facilitators at all times while prioritising candidates from unrepresented geographic regions.\n` +
    `\n` +
    `\n` +
    `Encouraging Participation\n` +
    `- Should work to maintain and encourage healthy debate, in accordance with the guidelines outlined in the Scientific Governance and Risk Framework and the Core Foundation Principals.\n` +
    `- Should ensure that the upcoming governance schedule is well communicated to all stakeholders at least a week in advance.\n` +
    `- Should aim to promote and increase engagement by stakeholders in the governance process. \n` +
    `- Should ensure that new members of the community understand the general level of decorum and civility expected by the group, that they have the resources they need to get onboarded quickly.\n` +
    `\n` +
    `Improving Efficiency\n` +
    `\n` +
    `- Should ensure that once debate reaches its natural end that appropriate consensus gathering methods take place.\n` +
    `- Should support and facilitate communications between the other mandated actors in the Maker Protocol.\n` +
    `- Should look for opportunities to streamline the governance process without sacrificing its integrity. \n` +
    `\n` +
    `Cohesion and Morale\n` +
    `- Responsible for raising community governance issues to the Maker Foundation or the third-party ecosystem and ensuring appropriate follow up for the community.\n` +
    `- Should help to build and maintain morale and engagement among members of the governance community.\n` +
    `- Should encourage the community to come to consensus over the least objectionable option(s) rather than treating decision-making as a competition where a subset of the community must end up disappointed in the outcome. \n` +
    `- Should work to bring the governance community together on divisive topics and to prevent political polarisation and demagoguery. \n` +
    `\n` +
    `**Selection Criteria**\n` +
    `    \n` +
    `The following criteria should be used when evaluating an individual for the role of Governance Facilitator:\n` +
    `\n` +
    `- Should have a complete understanding of the DIPs Framework and content, especially in relation to core governance DIPs.\n` +
    `- Required to be a community member for some time. This can be shown through various proof of participation methods, such as:\n` +
    `\t- Past forum posts\n` +
    `\t- Attendance of community and governance calls\n` +
    `\t- Input into issues of governance in any communications venue.\n` +
    `- Knowledge share will occur when onboarded but the candidate must be familiar with the roles and responsibilities of Governance Facilitators.\n` +
    `- Should have familiarity with the technical inner workings of the Maker Protocol (bonus)\n` +
    `- Must have experience engaging with different stakeholders in the community in all the different venues the community uses for communications including chat rooms, forums and video conference calls.\n` +
    `- Should be confident in expressing themselves in each of the different venues the community uses for communications including chat rooms, forums and video conference calls.\n` +
    `- Should have an interest in governance mechanisms used presently and historically across the world.\n` +
    `\n` +
    `**Removal**\n` +
    `\n` +
    `A Governance Facilitator should be considered for removal if they are:\n` +
    `-   Not adequately performing their defined duties\n` +
    `-   Absent from their duties for a prolonged period\n` +
    `-   Displaying biased or malicious behaviour\n` +
    `-   Expressing unwillingness to continue in their role.\n` +
    `    \n` +
    `The removal process begins once the community has agreed on the reasoning for removal. This process must be communicated publicly via the forums in order to provide complete transparency. **The Governance Facilitator will then be removed from the following channels:**\n` +
    `-   Github\n` +
    `-   RocketChat\n` +
    `-   Forums\n` +
    `\n` +
    `---\n` +
    `\n` +
    `### DIP${dipNumber_1}c12: Core Personnel Onboarding\n` +
    `\n` +
    `DIP${dipNumber_1}c12 is a Process DIP component that allows the onboarding of core personnel using a subproposal. DIP${dipNumber_1}c12 subproposals have the following parameters:\n` +
    `-   **Feedback Period**: 3 months\n` +
    `-   **Frozen Period**: 1 month\n` +
    `\n` +
    `DIP${dipNumber_1}c12 subproposals must use the template located at  **[DIP${dipNumber_1}c12-Subproposal-Template.md](DIP${dipNumber_1}c12-Subproposal-Template.md)**. This template is considered ratified once this DIP moves to Accepted status.\n` +
    `\n` +
    `---\n` +
    `\n` +
    `### DIP${dipNumber_1}c13: Core Personnel Offboarding\n` +
    `\n` +
    `DIP${dipNumber_1}c13 is a Process DIP component that allows the removal of core personnel using a subproposal. DIP${dipNumber_1}c13 subproposals have the following parameters:\n` +
    `\n` +
    `-   **Feedback Period**: 0 days\n` +
    `-   **Frozen Period**: 0 days\n` +
    `\n` +
    `DIP${dipNumber_1}c13 subproposals must use the template located at  **[DIP${dipNumber_1}c13-Subproposal-Template.md](DIP${dipNumber_1}c13-Subproposal-Template.md)**. This template is considered ratified once this DIP moves to Accepted status.\n` +
    `\n` +
    `---`,
  filename,
  sentenceSummary,
  paragraphSummary: paragraphSummaryMock,
  author: authorMock,
  contributors: contributorsMock,
  dateProposed: dateProposedMock,
  dateRatified: dateRatifiedMock,
  dependencies: dependenciesMock,
  dip,
  replaces: replacesMock,
  status: statusMock,
  title: titleMock,
  types: typesMock,
  votingPortalLink: votingPortalLinkMock,
  forumLink: forumLinkMock,
  tags: [tagsMock],
};

// ParseDIPsService (unit tests)
export const preambleMock: IPreamble = {
  ...dipData,
  dipName: faker.random.word(),
};
export const errorUpdateMock: string = faker.random.words();

// DIPsController (integration tests) and 
export const dipData_2: DIP = {
  ...dipData,
  dip: 1,
  filename: `DIP${dipNumber_2}/dip${dipNumber_2}.md`,
  sentenceSummary: `DIP${dipNumber_2} ${faker.lorem.words(5)}`,
  title: `${faker.lorem.words(5)} v2`,
  references: [],
  proposal: `DIP${dipNumber_2}`,
  subproposal: -1,
  tags: [faker.random.word()],
  status: faker.random.arrayElement(['Accepted', 'Rejected', 'RFC']),
  extra: [],
  language: Language.English,
  dipFather: false,
  components: [],
  sectionsRaw: [`DIP${dipNumber_2}`],
}
export const tagResultMock = {
  tag: dipData.tags[0],
};
export const statusResultMock = {
  status: dipData_2.status,
};
export const smartSearchFieldMock: string = faker.random.word();

// MarkedService unit tests
export const markedMock: string = faker.random.word();
export const markedLexerMock: any[] = [{
  type: faker.random.word(),
  value: faker.random.word(),
}];
export const requestGraphql: string = faker.random.word();
export const pullRequestsMock: RequestDocument = {
  definitions: [],
  kind: faker.random.word(),
};

// GithubService unit tests
export const openIssueTitleMock: string = faker.random.word();
export const openIssueBodyMock: string = faker.random.word();

// DIPsService unit test
export const dipFilesMapMock = new Map();
dipFilesMapMock.set(dipData.filename, dipData)