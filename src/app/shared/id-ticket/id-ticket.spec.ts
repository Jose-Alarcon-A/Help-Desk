import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdTicket } from './id-ticket';

describe('IdTicket', () => {
  let component: IdTicket;
  let fixture: ComponentFixture<IdTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdTicket],
    }).compileComponents();

    fixture = TestBed.createComponent(IdTicket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
