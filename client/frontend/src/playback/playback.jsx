import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import "../../styles/general.css";
import "./playback.css";
import "../../styles/scrollbar.css";
import {testCurrentlyPlaying , testQueueItems, testRecentlyPlayed} from "./testData.js";
import {useRef, useState} from "react";
import stopPlaying from "./playback_icons/stop.svg";
import resume from "./playback_icons/resume.svg";
import skip from "./playback_icons/skip.svg";
import goBack from "./playback_icons/go_back.svg";
import {useMediaQuery} from "@uidotdev/usehooks";

import {useRedirectLoggedOutUser} from "../../custom_hooks/sessionData.js";
export const Playback = () => {
    // const [isLoading] = useRedirectLoggedOutUser();
    const testSongLength = 3 * 60 * 1000;
    const isPhone = useMediaQuery("only screen and (max-width: 768px)");
    const [recentlyPlayedOpen, setRecentlyPlayedOpen] = useState(false);
    const [queueOpen, setQueueOpen] = useState(false);

    const recentlyPlayedContainer = useRef(null);
    const queueContainer = useRef(null);
    let isLoading
    if(isLoading === undefined || isLoading === null)  isLoading = false;
    return (
        <>
            <TopMenu/>
            {isLoading && <h1>LOADING...</h1>}
            {!isLoading && <main>
                {!isPhone && <SongContainer type={"QUEUE"} items={testQueueItems} isPhone={isPhone}/>}

                 <CurrentlyPlaying currentlyPlaying={testCurrentlyPlaying} songLength={testSongLength}/>

                {isPhone && <div>
                    <button className={"last-played"} onClick={() => setRecentlyPlayedOpen(true)}>RECENTLY PLAYED</button>
                    <button className={"queue"} onClick={() => setQueueOpen(true)}>QUEUE</button>
                </div>}
                {isPhone && recentlyPlayedOpen && <SongContainer ref={queueContainer}
                    type={"QUEUE"} items={testQueueItems} isPhone={isPhone} setClicked={setQueueOpen}/> }
                {(!isPhone || (recentlyPlayedOpen  && isPhone) ) &&<SongContainer ref={recentlyPlayedContainer}
                    type={"RECENTLY PLAYED"} items={testRecentlyPlayed} isPhone={isPhone} setClicked={setRecentlyPlayedOpen}/>}

            </main>}
        </>
    )
}

const SongContainer = ({items, type, isPhone, setClicked , ref}) => {
    return(
        <>
            <section ref={ref} className={isPhone ? "mobile-song-container" : ""}>
                <div className={"slide-down"}> </div>
                <button className={"close-button"} onClick={() => setClicked(false)}>X</button>
                <h2 className={"song-container-heading"}>{type}</h2>
                <div className={"song-container"}>
                    {items.map(i => <Item key={i.id} item={i}/> )}
                </div>
            </section>

        </>
    )
}

const Item = ({item}) => {
    return (
        <>
            <section className={"item"}>
                <div className={"img-box"}> <img src={item.src} alt={"song cover"} loading={"lazy"}/></div>
                <h2>{item.title}</h2>
            </section>
        </>
    )
}

const CurrentlyPlaying = ({currentlyPlaying, songLength}) =>{
    return(
        <>
            <div className={"currently-playing"}>
                <section className={"currently-playing"}>
                   <div className={"currently-playing-img-box"}>  <img loading={"lazy"} src={currentlyPlaying.image} alt={"song cover"} className={"currently-playing-img"}/> </div>
                    <h3>{currentlyPlaying.title}</h3>
                    <Controls songLength={songLength}/>
                </section>
            </div>
        </>
    )
}

const Controls = ({songLength}) => {
    const progressSlider = useRef(null);
    const [progress, setProgress] = useState(`00:00`);
    const [isPlaying, setIsPlaying] = useState(true);
    const addZero = num => num <= 9 ? `0${num}` : num;

    const calculateProgress = (songLength , sliderValue) => {
        const totalSeconds = Math.floor((songLength / 1000) * sliderValue * 0.01);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60
        setProgress(`${addZero(minutes)}:${addZero(seconds)}`);
    }

    return(
        <>
            <div className={"controls"}>
               <label><input ref={progressSlider} onChange={() => {calculateProgress(songLength, parseInt(progressSlider.current.value))}} type={"range"} min={0} max={100} step={1} className={"progress-slider"}/>{progress}</label>
                <div className={"controls-container"}>
                    <button className={"controls-button"}> <img src={goBack} alt={"play state icon"} loading={"lazy"}/> </button>
                    <button className={"controls-button"} onClick={() => setIsPlaying(prevState => !prevState)} ><img loading={"lazy"} src={isPlaying ? stopPlaying : resume} alt={"play state icon"}/></button>
                    <button className={"controls-button"}><img src={skip} alt={"skip song icon"} loading={"lazy"}/> </button>
                </div>
            </div>
        </>
    )
}