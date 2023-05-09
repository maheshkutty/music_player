import React, { createContext, useReducer } from "react";
import { spotifyApi } from "../api";

export const getSongsByTrack = async (id: Number) => {
  const { data } = await spotifyApi.post("", {
    operationName: "ExampleQuery",
    query: `query ExampleQuery($playlistId: Int!) {
          getSongs(playlistId: $playlistId) {
            duration
            url
            title
            photo
            artist
            _id
          }
        }`,
    variables: {
      playlistId: id
    }
  });
  return data;
}

export interface SongsListSchema {
  _id: string;
  artist: string;
  duration: Number;
  photo: string;
  title: string;
  url: string;
  playedSecond?: 0,
  played?: 0,
}

type SongData = {
  songs: Array<SongsListSchema>;
  selected: number;
  firstLoad: boolean,
}

type Action = {
  type: "track",
  songs: Array<SongsListSchema>,
  firstLoad: boolean
} | {
  type: "select",
  id: number
} | {
  type: "next",
} | {
  type: "prev",
}

const initialState = {
  songs: [],
  selected: -1,
  firstLoad: false,
}

export const SongContext = createContext<{
  state: SongData,
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => null
});

function reducers(data: SongData, action: Action): SongData {
  switch (action.type) {
    case 'track':
      return {
        ...data,
        songs: action.songs,
        firstLoad: action.firstLoad,
      }
    case 'select':
      return {
        ...data,
        selected: action.id
      }
    case 'next':
      return {
        ...data,
        selected: (data.selected + 1) % data.songs.length
      }
    case 'prev':
      return {
        ...data,
        selected: data.selected - 1 === 0 ? data.songs.length - 1 : data.selected - 1
      }
    default:
      return data
  }
}

export function SongProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducers, initialState);
  return (
    <SongContext.Provider value={{ state, dispatch }}>
      {children}
    </SongContext.Provider>
  )
}