import React, { useContext, useEffect, useState } from "react";
import { Input } from "antd";
import { List, Typography, Avatar, ConfigProvider, Skeleton } from "antd";
import VirtualList from 'rc-virtual-list';

import { SongContext, SongsListSchema } from "./context/songContext";
import "./common.scss";

export const PlayList: React.FC = () => {
  const { state, dispatch } = useContext(SongContext);
  const [songs, setSongs] = useState<Array<SongsListSchema>>([]);
  useEffect(() => {
    setSongs(state.songs)
  }, [state.songs])

  const onSearch = (value: string) => {
    if (value !== "")
      setSongs(songs.filter(song => song.title.toLocaleLowerCase().includes(value)));
    else
      setSongs(state.songs)
  }

  const selectSong = (id: number) => {
    dispatch({ type: "select", id });
  }

  if(!state.firstLoad) {
    return <Skeleton />
  }

  return (
    <div>
      <ConfigProvider theme={{
        token: {
          colorText: "white",
          colorBgContainer: "#2C3333",
          colorTextPlaceholder: "white",
          colorPrimaryHover: "white",
          colorPrimaryActive: "white"
        }
      }}>
        <Input.Search onSearch={onSearch} placeholder="Search Song, Artist" className="search" />
      </ConfigProvider>
      {
        songs.length > 0 ?
          (<List>
            <VirtualList data={songs}
              height={Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 50}
              itemHeight={47}
              itemKey="email"
            >
              {(song: SongsListSchema, ind) => (<List.Item className={`songList ${ind === state.selected ? 'active' : ''}`} onClick={() => selectSong(ind)} key={song._id}>
                <List.Item.Meta
                  style={{ paddingLeft: "1rem" }}
                  avatar={<Avatar src={song.photo} />}
                  title={<Typography.Text className="title">{song.title}</Typography.Text>}
                  description={<Typography.Text className="desc">{song.artist}</Typography.Text>}
                />
              </List.Item>)}
            </VirtualList>
          </List>) : null
       }
    </div>
  )
}