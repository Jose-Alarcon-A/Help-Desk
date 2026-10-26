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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
