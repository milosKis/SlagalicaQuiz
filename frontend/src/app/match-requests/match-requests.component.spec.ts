import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchRequestsComponent } from './match-requests.component';

describe('MatchRequestsComponent', () => {
  let component: MatchRequestsComponent;
  let fixture: ComponentFixture<MatchRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
