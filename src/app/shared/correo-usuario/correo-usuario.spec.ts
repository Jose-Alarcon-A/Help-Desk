import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorreoUsuario } from './correo-usuario';

describe('CorreoUsuario', () => {
  let component: CorreoUsuario;
  let fixture: ComponentFixture<CorreoUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorreoUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(CorreoUsuario);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('correo', 'ana.perez@correo.com');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renderiza el correo recibido', () => {
    const span = (fixture.nativeElement as HTMLElement)
      .querySelector('span.correo');

    expect(span?.textContent?.trim()).toBe('ana.perez@correo.com');
  });
});
