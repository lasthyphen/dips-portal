// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'http://localhost:3001',
  apiUrl: 'http://127.0.0.1:3001',
  // apiUrl: "https://dips-api.makerdao.com",
  repoUrl: 'https://github.com/lasthyphen/dips/tree/master',
  feedBackFormUrl: 'https://formspree.io/f/xzbyjjnb',
  githubURL: 'https://github.com/',
  menuURL:
    'https://raw.githubusercontent.com/lasthyphen/dips/master/meta/menu.yaml',
  menuURLAuxiliar:
    'https://raw.githubusercontent.com/lasthyphen/dips/master/meta/menu.json',
  varsURL:
    'https://raw.githubusercontent.com/lasthyphen/dips/master/meta/vars.yaml',
  newsURL:
    'https://raw.githubusercontent.com/lasthyphen/dips/master/meta/news.yaml',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
