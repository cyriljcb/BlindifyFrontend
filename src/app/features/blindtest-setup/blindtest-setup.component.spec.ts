import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlindtestSetupComponent } from './blindtest-setup.component';

describe('BlindtestSetupComponent', () => {
  let component: BlindtestSetupComponent;
  let fixture: ComponentFixture<BlindtestSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlindtestSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlindtestSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
