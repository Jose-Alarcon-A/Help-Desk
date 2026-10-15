import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TicketDetalle } from './ticket-detalle';

describe('TicketDetalle', () => {
  let component: TicketDetalle;
  let fixture: ComponentFixture<TicketDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetalle],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
