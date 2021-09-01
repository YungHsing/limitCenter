import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F01002Component } from './f01002.component';

describe('F01002Component', () => {
  let component: F01002Component;
  let fixture: ComponentFixture<F01002Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F01002Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(F01002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
