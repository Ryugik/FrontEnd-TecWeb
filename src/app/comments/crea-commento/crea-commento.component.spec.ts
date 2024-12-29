import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaCommentoComponent } from './crea-commento.component';

describe('CreaCommentoComponent', () => {
  let component: CreaCommentoComponent;
  let fixture: ComponentFixture<CreaCommentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreaCommentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreaCommentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
