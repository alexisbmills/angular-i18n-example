import { AngularIntPage } from './app.po';

describe('angular-int App', () => {
  let page: AngularIntPage;

  beforeEach(() => {
    page = new AngularIntPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
