import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistTracksComponent } from './playlist-tracks.component';

describe('PlaylistTracksComponent', () => {
  let component: PlaylistTracksComponent;
  let fixture: ComponentFixture<PlaylistTracksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistTracksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistTracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
