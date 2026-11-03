import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import "../../styles/general.css";
import "./playlists.css";
import {testPlaylists} from "./testData.js";
import {useRef, useState} from "react";
import {useLikedSongs} from "../../custom_hooks/usePlaylists.js";

export const Playlists = () => {
    const [selected, setSelected] = useState([]);
    const [playlistNames, setNames] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, hasLikedSongs] = useLikedSongs();

    const moods = ["energetic" , "chill" , "sad" , "happy"];

    const generate = async (selected) => {
        const response = await fetch(`/api/generatePlaylists?id=${selected}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if(response.status !== 204){
            setError("problem accused when generating playlist. try again later. ");
        }
    }

    const updateSelected = (p) => {
        setSelected(prevState=>{
            if(prevState.includes(p.id)) return [...prevState.filter(name => name !== p.id)];
            else if(prevState.length < 5 ) return [...prevState, p.id];
            else return [...prevState];
        });

        setNames(prevState => {
            if(prevState.includes(p.title)) return [...prevState.filter(title => title !== p.title)];
            else if(prevState.length < 5) return [...prevState, p.title];
            else return [...prevState];
        });

    }

    return(
        <>
            <TopMenu/>
            <main>
                <section hidden={!isLoading}>
                    <h2>Select playlist</h2>
                    <div className={"playlist-box"}>
                        {testPlaylists.map(p => <Playlist
                            item={p}
                            key={p.id}
                            id={p.id}
                            selected={selected}
                            onClick={() => updateSelected(p)} />)}
                    </div>
                </section>

                <div hidden={!isLoading}>
                    <section className={`creation-menu`}>
                        <label>UNIQUE playlist name<input type={"text"} placeholder={"playlist name..."}/></label>
                        <label>select mood <select>
                            {moods.map(m => <option key={m}>{m}</option>)}
                        </select></label>
                        <button className={"action-btn"}>GENERATE PLAYLIST</button>
                    </section>

                    <div className={"select-box"}>SELECTED PLAYLIST: {playlistNames.length> 0 ? playlistNames.map(n => <p>{n}</p>) : "NONE"} </div>
                </div>

                {!isLoading  && <h2>LOADING...</h2> }
            </main>
        </>
    )
}

function Playlist({item, id, selected, onClick} ){

    return (
        <section className={"playlist"} onClick={onClick}>

            <div className={`img-box ${selected.includes(id) ? 'selected-playlist' : ""}`} id={`${id}`}>
                <img src={item.src} alt={"playlist img"}/>
            </div>
            <h3>{item.title}</h3>
        </section>
    );
}