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
    fixture.componentRef.setInput('id', '1');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renderiza el id recibido', () => {
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelector('.id')?.textContent?.trim()).toBe('1');
  });
});
