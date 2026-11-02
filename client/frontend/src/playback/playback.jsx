import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import "../../styles/general.css";
import "./playback.css";
import {testCurrentlyPlaying , testQueueItems, testRecentlyPlayed} from "./testData.js";

export const Playback = () => {
    return (
        <>
            <TopMenu/>
            <main>
                <SongContainer type={"QUEUE"} items={testQueueItems}/>
                <CurrentlyPlaying currentlyPlaying={testCurrentlyPlaying}/>
                <SongContainer type={"RECENTLY PLAYED"} items={testRecentlyPlayed}/>
            </main>
        </>
    )
}

const SongContainer = ({items, type}) => {
    return(
        <>
            <section className={"song-container"}>
                <h2>{type}</h2>
                {items.map(i => <Item key={i.id} item={i}/> )}
            </section>
        </>
    )
}

const Item = ({item}) => {
    return (
        <>
            <section className={"item"}>
                <div className={"img-box"}> <img src={item.src} alt={"song cover"}/></div>
                <h2>{item.title}</h2>
            </section>
        </>
    )
}

const CurrentlyPlaying = ({currentlyPlaying}) =>{
    return(
        <>
            <div className={"currently-playing"}>
                <section className={"currently-playing"}>
                   <div className={"currently-playing-img-box"}>  <img src={currentlyPlaying.image} alt={"song cover"} className={"currently-playing-img"}/> </div>
                    <h3>{currentlyPlaying.title}</h3>
                    <Controls/>
                </section>
            </div>
        </>
    )
}

const Controls = () => {
    return(
        <>
            <div className={"controls"}>
               <label><input type={"range"} min={0} max={100} className={"progress-slider"}/>{"0:00"} </label>
                <div className={"controls-container"}>
                    <button className={"controls-button"}>SKIP TO PREVIOUS</button>
                    <button className={"controls-button"}>STOP/RESUME</button>
                    <button className={"controls-button"}>SKIP TO NEXT</button>
                </div>
            </div>
        </>
    )
}