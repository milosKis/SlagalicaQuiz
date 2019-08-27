import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePairsSingleComponent } from './game-pairs-single.component';

describe('GamePairsSingleComponent', () => {
  let component: GamePairsSingleComponent;
  let fixture: ComponentFixture<GamePairsSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamePairsSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePairsSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
