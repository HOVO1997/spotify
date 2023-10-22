export interface RawCurrentAlbumModel {
  data: {
    duration: { totalMilliseconds: string },
    albumOfTrack: { coverArt: { sources: { url: string, width: number, height: number }[] } },
    active: boolean,
    index: number,
    id: string
  }
}

export interface CurrentAlbumModel {
    duration: { totalMilliseconds: string },
    albumOfTrack: { coverArt: { sources: { url: string, width: number, height: number }[] } },
    active: boolean,
    index: number,
    id: string
}
