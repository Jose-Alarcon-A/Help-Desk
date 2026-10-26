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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
