import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCombinationsSingleComponent } from './game-combinations-single.component';

describe('GameCombinationsSingleComponent', () => {
  let component: GameCombinationsSingleComponent;
  let fixture: ComponentFixture<GameCombinationsSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameCombinationsSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCombinationsSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
