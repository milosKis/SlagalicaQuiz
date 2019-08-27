import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAssociationsSingleComponent } from './game-associations-single.component';

describe('GameAssociationsSingleComponent', () => {
  let component: GameAssociationsSingleComponent;
  let fixture: ComponentFixture<GameAssociationsSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameAssociationsSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameAssociationsSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
