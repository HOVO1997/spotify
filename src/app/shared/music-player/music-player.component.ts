import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import WaveSurfer from "wavesurfer.js";
import {MatSliderModule} from "@angular/material/slider";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatRippleModule} from "@angular/material/core";
import {DestroyService} from "../../core/services/destroy.service";
import {takeUntil} from "rxjs";

@Component({
  selector: 'app-music-player',
  standalone: true,
  imports: [
    CommonModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatIconModule,
    MatRippleModule
  ],
  providers: [
    DestroyService
  ],
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicPlayerComponent implements OnInit {
  @ViewChild('waveform') waveform!: ElementRef<HTMLDivElement>;
  @Output() onMusicPlaying: EventEmitter<boolean> = new EventEmitter();
  @Output() onPrevPressing: EventEmitter<void> = new EventEmitter();
  @Output() onNextPressing: EventEmitter<void> = new EventEmitter();

  @Input({required: true}) set changeSong(value: { url: string, play: boolean } | null) {
    if (this.wave && value) {
      Promise.resolve().then((): void => {
        this.wave.load(value.url).then(_ => {
          this.onMusicPlaying.emit(value.play);
          if (value.play) {
            return this.wave.play();
          }
          return;
        });
      });
    }
  }

  public soundVolumeControl: FormControl = new FormControl(100);
  private wave!: WaveSurfer;
  private url: string = '';
  public time: string = '0:00';
  public duration: string = '0:00';

  constructor(
    private cdr: ChangeDetectorRef,
    private readonly viewDestroyed$: DestroyService
  ) {
  }

  ngOnInit(): void {
    this.loadWavePlayer();
    this.listenSoundValueControlChange();
  }

  public prev(): void {
    this.onPrevPressing.emit();
  }

  public next(): void {
    this.onNextPressing.emit();
  }

  private loadWavePlayer(): void {
    if (!this.wave) {
      this.generateWaveform();
    }
    this.cdr.detectChanges();
  }

  public play(): void {
    if (!this.wave.isPlaying()) {
      Promise.resolve().then(() => {
        this.onMusicPlaying.emit(true);
        return this.wave.play();
      });
    } else {
      Promise.resolve().then(() => {
        this.onMusicPlaying.emit(false);
        return this.wave.pause();
      });
    }
  }

  generateWaveform(): void {
    const ctx = document.createElement('canvas').getContext('2d')
    const gradient = ctx!.createLinearGradient(0, 0, 0, 150)
    gradient.addColorStop(0, '#3cb267')
    gradient.addColorStop(0.7, '#78bb8d')
    gradient.addColorStop(1, '#99b9a5')

    Promise.resolve(null).then(() => {
      this.wave = WaveSurfer.create({
        backend: 'MediaElement',
        container: this.waveform.nativeElement,
        waveColor: gradient,
        height: 80,
        progressColor: '#1DB954',
        url: this.url,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
      });
      this.wave.on('decode', (duration) => {
        this.duration = this.formatTime(duration);
        this.cdr.markForCheck();
      })
      this.wave.on('timeupdate', (currentTime) => {
        this.time = this.formatTime(currentTime);
        this.cdr.markForCheck();
      })
    });
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60)
    const secondsRemainder: number = Math.round(seconds) % 60
    const paddedSeconds: string = `0${secondsRemainder}`.slice(-2)
    return `${minutes}:${paddedSeconds}`
  }

  public get soundValueIcon(): string {
    if (this.soundVolumeControl.value >= 50) {
      return 'volume_up';
    } else if (this.soundVolumeControl.value < 50 && this.soundVolumeControl.value > 0) {
      return 'volume_down';
    } else {
      return 'volume_mute';
    }
  }

  public get actionIcon(): string {
    if (this.wave && this.wave.isPlaying()) {
      return 'pause_circle';
    } else {
      return 'play_circle';
    }
  }

  private listenSoundValueControlChange(): void {
    this.soundVolumeControl.valueChanges
      .pipe(takeUntil(this.viewDestroyed$))
      .subscribe(volume => {
        this.wave.setVolume(volume / 100);
      });
  }
}
