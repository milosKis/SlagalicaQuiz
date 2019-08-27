import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDayInputComponent } from './game-day-input.component';

describe('GameDayInputComponent', () => {
  let component: GameDayInputComponent;
  let fixture: ComponentFixture<GameDayInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDayInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDayInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
