import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotePostHomepageComponent } from './vote-post-homepage.component';

describe('VotePostHomepageComponent', () => {
  let component: VotePostHomepageComponent;
  let fixture: ComponentFixture<VotePostHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotePostHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VotePostHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
