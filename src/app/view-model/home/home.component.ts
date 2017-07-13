import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  languages = [
    {code: 'en', label: 'English'},
    {code: 'es', label: 'Español'},
  ];

  stateForm: FormGroup;

  name: string;

  dependents: number;

  constructor(@Inject(LOCALE_ID) public localeId: string,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.name = localStorage.getItem('name') || '';
    this.dependents = this.toNumber(localStorage.getItem('dependents'));
    this.stateForm = this.formBuilder.group({
      name: [{value: this.name, disabled: false}],
      dependents: [{value: this.dependents, disabled: false}]
    })
  }

  onSubmit() {
    this.name = this.stateForm.get('name').value;
    this.dependents = this.toNumber(this.stateForm.get('dependents').value);
    localStorage.setItem('name', this.name);
    localStorage.setItem('dependents', this.stateForm.get('dependents').value);
  }

  private toNumber(param: string) {
    return parseInt(param, 10) || 0;
  }
}
