import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameWordsComponent } from './game-words.component';

describe('GameWordsComponent', () => {
  let component: GameWordsComponent;
  let fixture: ComponentFixture<GameWordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameWordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
