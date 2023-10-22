import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatTableModule} from "@angular/material/table";
import {SpotifyService} from "../../core/services/spotify.service";
import {MusicPlayerComponent} from "../../shared/music-player/music-player.component";
import {MillisecondToMMSSPipe} from "../../core/pipes/millisecond-to-mmss.pipe";
import {AlbumModel} from "../../core/models/album.model";
import {CurrentAlbumModel, RawCurrentAlbumModel} from "../../core/models/current-album.model";
import {TrackModel} from "../../core/models/track.model";
import {DestroyService} from "../../core/services/destroy.service";
import {takeUntil} from "rxjs";

@Component({
  selector: 'app-music-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MusicPlayerComponent,
    NgOptimizedImage,
    MillisecondToMMSSPipe
  ],
  providers: [
    SpotifyService,
    DestroyService
  ],
  templateUrl: './music-list.component.html',
  styleUrls: ['./music-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicListComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'avatar', 'name', 'duration'];
  public musicList: CurrentAlbumModel[] = [];
  public currentSong: {url: string, play: boolean} | null = null;
  public isMusicPlaying: boolean = false;
  private currentSongIndex: number = 0;

  constructor(
    private spotifyService: SpotifyService,
    private cdr: ChangeDetectorRef,
    private readonly viewDestroyed$: DestroyService
  ) {}

  ngOnInit(): void {
    this.getMusicList();
  }

  private getMusicList(): void {
    this.spotifyService.getAlbum()
      .pipe(takeUntil(this.viewDestroyed$))
      .subscribe((response: AlbumModel): void => {
        response.tracks.items.forEach((item: RawCurrentAlbumModel, index: number): void => {
          this.musicList.push({...item.data, active: false, index: index});
        });
        this.play(this.musicList[0], false);
        this.cdr.markForCheck()
    });
  }

  public play(row: CurrentAlbumModel, play: boolean): void {
    this.resetActivities(row);
    this.currentSongIndex = row.index;
    this.spotifyService.getSong(row.id)
      .pipe(takeUntil(this.viewDestroyed$))
      .subscribe((response: TrackModel): void => {
      this.currentSong = {url: response.tracks[0].preview_url, play};
      this.cdr.markForCheck();
    })
  }

  private resetActivities(row: CurrentAlbumModel): void {
    this.musicList.forEach((song: CurrentAlbumModel) => song.active = false);
    this.musicList.find((song: CurrentAlbumModel) => song.id === row.id)!.active = true;
  }

  public onMusicPlaying(event: boolean): void {
    this.isMusicPlaying = event;
  }

  public onPrevPressing(): void {
    if (this.currentSongIndex > 0) {
      this.play(this.musicList[this.currentSongIndex - 1], true);
    }
  }

  public onNextPressing(): void {
    if (this.currentSongIndex < 39) {
      this.play(this.musicList[this.currentSongIndex + 1], true);
    }
  }
}
