import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VediPostComponent } from './vedi-post.component';

describe('VediPostComponent', () => {
  let component: VediPostComponent;
  let fixture: ComponentFixture<VediPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VediPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VediPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
