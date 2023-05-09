import React, { useState, useEffect, useRef, useContext } from "react";
import ReactPlayer from "react-player";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCirclePause, faFastForward, faFastBackward, faBars, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import ColorThief from "colorthief"
import { setColor } from "./setColor";
import { SongContext } from "./context/songContext";

import "./common.scss";

interface PlayerProps {
  setShowTracks: () => void;
  setShowSongsList: () => void;
}

const defaultPlayerState = {
  url: null,
  pip: false,
  playing: false,
  controls: false,
  light: false,
  volume: 0.8,
  muted: false,
  played: 0,
  loaded: 0,
  duration: 0,
  playbackRate: 1.0,
  loop: false,
  seeking: true,
}

export const Player: React.FC<PlayerProps> = (props) => {
  const rPlayer = useRef<any>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [playerState, setPlayerState] = useState(defaultPlayerState);
  const { state, dispatch } = useContext(SongContext);
  const [song, setSong] = useState({
    _id: "",
    url: "",
    title: "",
    artist: "",
    photo: "",
    played: 0,
    playedSecond: 0
  });

  useEffect(() => {
    if (state.selected !== -1)
      setSong({ ...state.songs[state.selected], played: 0, playedSecond: 0 })
    setPlayerState(defaultPlayerState);
  }, [state.selected])

  const handleClick = () => {
    setPlayerState({ ...playerState, playing: !playerState.playing })
  }

  const handleSeekMouseDown = (e: any) => {
    setPlayerState({ ...playerState, seeking: true })
  }

  const handleSeekChange = (e: any) => {
    setPlayerState({ ...playerState, played: parseFloat(e.target.value) })
    rPlayer.current.seekTo(parseFloat(e.target.value))
  }

  const handleSeekMouseUp = (e: any) => {
    setPlayerState({ ...playerState, seeking: false })
    rPlayer.current.seekTo(parseFloat(e.target.value))
  }

  function rgbToHex(r: any, g: any, b: any) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

  const extractColor = () => {
    try {
      const colorThief = new ColorThief();
      if (imgRef.current?.complete) {
        imgRef.current.crossOrigin = "Anonymos";
        const colorRGB = colorThief.getColor(imgRef.current);
        const colorHex = setColor(rgbToHex(colorRGB[0], colorRGB[1], colorRGB[2]))
        console.log(colorHex);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleProgress = (state: any) => {
    console.log('onProgress', state)
    if (progressRef.current)
      progressRef.current.value = state.played;
  }

  return (
    (song._id !== "") ? <div className={`container2`}>
      <ReactPlayer
        style={{ display: "none" }}
        ref={rPlayer}
        width="0%"
        height="0%"
        playing={playerState.playing}
        controls={playerState.controls}
        url={song?.url}
        onProgress={handleProgress}
      />
      <div>
        <FontAwesomeIcon icon={faBars} className="specialIcon" onClick={props.setShowTracks} />
        <p className="title">{song?.title}</p>
        <p className="desc">{song?.artist}</p>
      </div>
      <div style={{ margin: 0 }}>
        <img ref={imgRef} src={song?.photo} className="banner_wrap" onLoad={extractColor} />
      </div>
      <div className="sliderContainer">
        <input
          className="item"
          style={{ width: "13rem" }}
          ref={progressRef}
          type="range"
          min={0}
          max={0.999999}
          step="any"
          value={playerState.played === 0 ? song?.played : playerState.played}
          onMouseDown={handleSeekMouseDown}
          onChange={handleSeekChange}
          onMouseUp={handleSeekMouseUp}
        />
      </div>
      <div className="sliderContainer">
        <FontAwesomeIcon icon={faFastBackward} size="lg" className="icon" onClick={() => dispatch({ type: "prev" })} />
        <div className="sliderContainer" onClick={handleClick}>
          {playerState.playing ? <FontAwesomeIcon icon={faCirclePause} size="2x" className="icon" /> :
            <FontAwesomeIcon icon={faCirclePlay} size="2x" className="icon" />}
        </div>
        <FontAwesomeIcon icon={faFastForward} size="lg" className="icon" onClick={() => dispatch({ type: "next" })} />
        <div style={{ textAlign: "end", float: "right" }} onClick={props.setShowSongsList} className="specialIcon">
          <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
        </div>
      </div>
    </div> : null
  )
}