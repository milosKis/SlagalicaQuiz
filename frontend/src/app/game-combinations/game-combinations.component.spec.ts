import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCombinationsComponent } from './game-combinations.component';

describe('GameCombinationsComponent', () => {
  let component: GameCombinationsComponent;
  let fixture: ComponentFixture<GameCombinationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameCombinationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCombinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
