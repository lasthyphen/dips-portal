import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DipsService } from '../../services/dips.service';
import { UrlService } from 'src/app/services/url/url.service';
import { LangService } from 'src/app/services/lang/lang.service';
import { Language } from 'src/app/data-types/languages';
import { DarkModeService } from 'src/app/services/dark-mode/dark-mode.service';
import {DetailContentComponent} from '../../components/detail-content/detail-content.component';
const YAML = require('yaml');
@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss'],
})
export class DetailsPageComponent implements OnInit {
  dip: any;
  mdUrl: any;
  sections: any;
  pullrequest: any;
  dipName: string;
  dipPosition: number;
  total: number;
  MAX_LIMIT: number = 1000000;
  subproposals: any[];
  referencesContent: string[];
  loadingUrl: boolean = true;
  references = [];
  languagesAvailables: any[];
  documentLanguage: Language;
  TABS_OPTIONS = ['Languages', 'Details', 'Recent Changes', 'References'];
  selectedTab:
    | 'Languages'
    | 'Details'
    | 'Recent Changes'
    | 'References'
    | null = null;

  @ViewChild('detail') detail: DetailContentComponent;
  constructor(
    private dipsService: DipsService,
    private activedRoute: ActivatedRoute,
    private router: Router,
    public darkModeService: DarkModeService,
    private langService: LangService,
    private urlService: UrlService
  ) {}

  ngOnInit(): void {
    this.loadingUrl = true;
    this.documentLanguage = this.langService.lang as Language;

    this.activedRoute.paramMap.subscribe((paramMap) => {
      if (paramMap.has('name')) {
        this.documentLanguage = this.langService.lang as Language;
        this.dipName = paramMap.get('name');
        this.total = this.dipsService.getTotal();
        this.loadData();
        this.moveToElement();
      }
    });

    this.activedRoute.queryParamMap.subscribe((queryParam) => {
      if (queryParam.has('mdUrl') && !queryParam.has('fromChild')) {
        const url = queryParam.get('mdUrl');

        const shouldUpdateUrl = this.urlService.getMdFromGithubUrl(url);
        if (shouldUpdateUrl) {
          this.router.navigateByUrl(this.urlService.transformLinkForMd(url));
        } else this.mdUrl = url;
        this.moveToElement();
      }
    });
  }

  headingListUpdate(event) {
    this.loadingUrl = false;
    if (this.mdUrl) {
      this.sections = null;
      this.sections = event;

      if (this.detail){
        this.detail.sections = this.sections;
        this.detail.doReloadSourceData();
      }
    }
  }

  translateKeywords(
    sectionsRaw: any[],
    metaVars: any[],
    sections: Boolean = false
  ) {
    const translationToUse = metaVars.find(
      (item) => item.language === this.documentLanguage
    );
    const keywords = translationToUse?.translations?.reserved;
    if (keywords) {
      if (sections) {
        // Translation of the keywords for heading for the lateral menu
        const updatedSections = sectionsRaw.map((item) => {
          let heading = item.heading;
          Object.keys(keywords).forEach((key) => {
            heading = heading.replace(key, keywords[key]);
          });
          return { ...item, heading };
        });

        return updatedSections;
      } else {
        // Translation of the keywords for heading for the main Document
        const updatedSectionsRaw = sectionsRaw.map((item) => {
          Object.keys(keywords).forEach((key) => {
            item = item.replace(key, keywords[key]);
          });
          return item;
        });

        return updatedSectionsRaw;
      }
    }
    return sectionsRaw;
  }

  loadData(): void {
    const lang: Language =
      this.documentLanguage ||
      (this.langService.lang as Language) ||
      Language.English;

    this.dipsService.getDipWithLanguage(this.dipName, lang).subscribe(
      (data) => {
        const metaVars = data.metaVars.map((item) => ({
          ...item,
          translations: YAML.parse(item.translations),
        }));

        this.dip = {
          ...data.dip,
        };

        this.references = data.dip?.references?.filter((item) => {
          return item.name !== '\n';
        });

        this.sections = this.dip.sections;

        let indexPreambleSection: number = (this.sections as []).findIndex(
          (i: any) => i.heading === 'Preamble'
        );

        if (indexPreambleSection !== -1) {
          (this.sections as []).splice(indexPreambleSection, 1);
        }

        let indexPreambleHeading: number = data.dip.sectionsRaw.findIndex(
          (i: any) => (i as string).includes('Preamble')
        );

        let sectionsRaw = [...(this.dip.sectionsRaw as [])];

        if (indexPreambleHeading !== -1) {
          sectionsRaw.splice(indexPreambleHeading, 2); // delete Preamble heading and its content
        }

        let indexReferencesSection: number = (this.sections as []).findIndex(
          (i: any) => i.heading === 'References'
        );

        if (indexReferencesSection !== -1) {
          (this.sections as []).splice(indexReferencesSection, 1);
        }

        let indexReferencesHeading: number = (sectionsRaw as []).findIndex(
          (i: any) => (i as string).includes('References')
        );

        if (indexReferencesHeading !== -1) {
          (sectionsRaw as []).splice(indexReferencesHeading, 2);
        }

        this.dip = {
          ...this.dip,
          sectionsRaw: this.translateKeywords(sectionsRaw, metaVars),
        };

        this.sections = this.sections.map((item) => ({
          ...item,
          initialName: item.heading,
        }));
        this.sections = this.translateKeywords(
          [...this.sections],
          metaVars,
          true
        );

        if (Object.values(Language).includes(data.dip.language)) {
          this.documentLanguage = data.dip.language as Language;
        }
        this.languagesAvailables = data.languagesAvailables;

        this.pullrequest = data.pullRequests;
        this.subproposals = data.subproposals;

        if (!this.dipsService.getDipsData()) {
          this.getDips();
        } else if (this.dip.proposal && !this.dipsService.includeSubproposals) {
          this.dipsService.includeSubproposals = true;
          this.getDips();
        }

        this.loadingUrl = false;
      },
      (error) => {
        if (error.error && error.error.statusCode === 404) {
          this.router.navigate(['page-not-found'], {
            skipLocationChange: true,
          });
        }
      }
    );
    const data = this.dipsService.getDipsData();

    if (data) {
      this.dipPosition = data.findIndex(
        (item) => item.dipName === this.dipName
      );
    }
  }

  updateDocumentLanguage(newLang: Language) {
    this.dip = null;
    this.loadingUrl = true;
    this.documentLanguage = newLang;
    this.loadData();
  }

  dipsPagination(position: number): void {
    const data = this.dipsService.getDipsData();
    this.dipName = data[position].dipName;

    this.router.navigate(['/dips/details', this.dipName]);
  }

  moveToElement(): void {
    const el = document.getElementById('logo');
    el.scrollIntoView();
  }

  getDips(): void {
    let order = 'dip';
    let filter = {
      contains: [],
      notcontains: [],
      equals: [],
      notequals: [],
      inarray: [],
    };

    filter.notequals.push({ field: 'dip', value: -1 });

    order = 'dip subproposal';
    this.dipsService.includeSubproposals = true;

    this.searchDips(this.MAX_LIMIT, 0, order, '', filter);
  }

  searchDips(limit, page, order, search, filter): void {
    this.dipsService
      .searchDips(limit, page, order, search, filter, 'dipName')
      .subscribe((data) => {
        this.dipsService.setDipsData(data.items);
        this.total = data.total;
        this.dipsService.setTotal(this.total);
        const dips = this.dipsService.getDipsData();
        this.dipPosition = dips.findIndex(
          (item) => item.dipName === this.dipName
        );
      });
  }

  ngOnDestroy() {
    this.dipsService.setDipsData(null);
    this.dipsService.includeSubproposals = false;
  }
}
