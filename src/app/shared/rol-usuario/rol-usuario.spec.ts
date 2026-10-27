import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolUsuario } from './rol-usuario';

describe('RolUsuario', () => {
  let component: RolUsuario;
  let fixture: ComponentFixture<RolUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(RolUsuario);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('rol', 'Administrador');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renderiza el rol con su clase correspondiente', () => {
    const span = (fixture.nativeElement as HTMLElement)
      .querySelector('span.rol');

    expect(span?.textContent?.trim()).toBe('Administrador');
    expect(span?.classList.contains('rol-administrador')).toBe(true);
  });
});
