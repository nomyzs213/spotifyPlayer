import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import "../../styles/general.css";
import "./playback.css";

export const Playback = () => {
    return (
        <>
            <TopMenu/>
            <main>

            </main>
        </>
    )
}

const Queue = ({items}) => {
    return(
        <>
            <section className={"queue"}>
                <h2>Queue</h2>
                {items.map(i => <Item key={i.id} item={i}/> )}
            </section>
        </>
    )
}

const Item = ({item}) => {
    return (
        <>
            <section className={"item"}>
                <h3>{item.title}</h3>
                <div className={"img-box"}> <img src={item.src} alt={"song cover"}/></div>
            </section>
        </>
    )
}

const CurrentlyPlaying = ({currentlyPlaying}) =>{
    return(
        <>
            <div>
                <section className={"currently-playing"}>
                    <img src={currentlyPlaying.image} alt={"song cover"}  className={"currently-playing-img"}/>
                    <h3>{currentlyPlaying.title}</h3>
                </section>
            </div>

        </>
    )
}

const Controls = () => {
    return(
        <>
            <div>
                <input type={"range"} min={0} max={100} className={"volume-slider"}/>
                <div className={"controls-container"}>
                    /*  bedzie trzeba podmienic na prawdziwe ikonki zamiast tekstu
                    TUTAJ
                    */<button className={"controls-button"}>SKIP TO PREVIOUS</button>
                    <button className={"controls-button"}>STOP/RESUME</button>
                    <button className={"controls-button"}>SKIP TO NEXT</button>
                </div>
            </div>
        </>
    )
}