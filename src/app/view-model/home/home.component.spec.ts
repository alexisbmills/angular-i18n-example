import {LOCALE_ID, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {By} from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        {provide: LOCALE_ID, useValue: 'en'}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should provide a link to change locale to Espanol when viewing as English', () => {
    const i18nLink = fixture.debugElement.query(By.css('a.i18n-link'));
    expect(i18nLink).toBeTruthy();
    expect(i18nLink.properties.href).toContain('/es/')
  });

  it('should provide a link to change locale to English when viewing as Espanol', () => {
    component.localeId = 'es';
    fixture.detectChanges();
    const i18nLink = fixture.debugElement.query(By.css('a.i18n-link'));
    expect(i18nLink).toBeTruthy();
    expect(i18nLink.properties.href).toContain('/en/')
  });
});
