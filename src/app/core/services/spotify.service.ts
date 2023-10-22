import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {AlbumModel} from "../models/album.model";
import {TrackModel} from "../models/track.model";

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient) { }

  public getAlbum(): Observable<AlbumModel> {
    return this.http.get<AlbumModel>(environment.spotifyApi + 'search/', {
      params: {
        q: 'Weeknd',
        type: 'multi',
        offset: '0',
        limit: '40',
      }
    });
  }

  public getSong(id: string): Observable<TrackModel> {
    return this.http.get<TrackModel>(environment.spotifyApi + 'tracks/', {
      params: {
        ids: id
      },
    });
  }
}
