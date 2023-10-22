import {RawCurrentAlbumModel} from "./current-album.model";

export interface AlbumModel {
  tracks: {
    items: RawCurrentAlbumModel[]
  }
}
