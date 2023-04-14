// When runing the backend on the same machine, run
//ng serve -c fullstack or npm run start:dev
//in orden instruct this file to replace enviroment.ts

export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:3000',
  //apiUrl: 'http://159.203.86.45:3001',
  // apiUrl: "https://dips-api.makerdao.com",
  repoUrl: 'https://github.com/lasthyphen/dips/tree/master',
  feedBackFormUrl: 'https://formspree.io/f/xyybvgej',
  githubURL: 'https://github.com/',
  menuURL:'https://raw.githubusercontent.com/lasthyphen/dips/master/meta/menu.yaml',
  menuURLAuxiliar:'https://raw.githubusercontent.com/lasthyphen/dips/master/meta/menu.json',
  varsURL: 'https://raw.githubusercontent.com/lasthyphen/dips/master/meta/vars.yaml',
  newsURL: 'https://raw.githubusercontent.com/lasthyphen/dips/master/meta/news.yaml'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
