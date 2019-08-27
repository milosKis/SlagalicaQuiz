import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSingleComponent } from './game-single.component';

describe('GameSingleComponent', () => {
  let component: GameSingleComponent;
  let fixture: ComponentFixture<GameSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
