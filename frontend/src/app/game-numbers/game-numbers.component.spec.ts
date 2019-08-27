import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameNumbersComponent } from './game-numbers.component';

describe('GameNumbersComponent', () => {
  let component: GameNumbersComponent;
  let fixture: ComponentFixture<GameNumbersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameNumbersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
