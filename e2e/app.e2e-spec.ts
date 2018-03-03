import { AngularTrufflePage } from './app.po';

describe('angular-truffle App', () => {
  let page: AngularTrufflePage;

  beforeEach(() => {
    page = new AngularTrufflePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    // per https://github.com/DefinitelyTyped/DefinitelyTyped/issues/15215#issuecomment-287280031
    expect<any>(page.getParagraphText()).toEqual('Metacoin ~ Angular4 + Truffle Starter Dapp');
  });
});
