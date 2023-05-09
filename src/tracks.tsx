import React, { useEffect, useState, useContext } from "react";
import { List, Typography, Skeleton } from "antd";
import { spotifyApi } from "./api";
import "./common.scss";
import { SongContext, getSongsByTrack } from "./context/songContext";

interface TrackListSchema {
  id: Number;
  title: string;
}

export const Tracks: React.FC = () => {
  const [selectedTracks, setSelectedTracks] = useState<Number>(1);
  const [trackList, setTrackList] = useState<TrackListSchema[]>([]);
  const { dispatch } = useContext(SongContext);
  useEffect(() => {
    async function callApi() {
      const tracks = await spotifyApi.post("", {
        operationName: "ExampleQuery",
        query: `query ExampleQuery {
          getPlaylists {
            id
            title
          }
        }`
      });
      setTrackList(tracks.data.data.getPlaylists);
      const { data } = await getSongsByTrack(0);
      dispatch({ type: "track", songs: data.getSongs, firstLoad: true })
    }
    callApi();
  }, [])

  const fillSongs = async (id: Number) => {
    setSelectedTracks(id)
    const { data } = await getSongsByTrack(id);
    dispatch({ type: "track", songs: data.getSongs, firstLoad: true })
  }

  if (trackList.length === 0) {
    return <Skeleton />
  }

  return (
    <List
      bordered={false}
      dataSource={trackList}
      renderItem={(item) => (
        <div className={`tracksList ${item.id === selectedTracks ? 'active' : ''}`} onClick={() => {
          fillSongs(item.id)
        }}>
          <Typography.Text className="title">{item.title}</Typography.Text>
        </div>
      )}
    />
  )
}