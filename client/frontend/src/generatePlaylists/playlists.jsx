import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import "../../styles/general.css";
import "./playlists.css";
import {testPlaylists} from "../playback/testData.js";
import {useState} from "react";
import {useLikedSongs} from "../../custom_hooks/usePlaylists.js";

export const Playlists = () => {
    const [selected, setSelected] = useState(null);
    const [playlistName, setName] = useState(null);
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
                            onClick={() => {setSelected(p.id); setName(p.title)}} />)}
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

                    <p className={"select-box"}>SELECTED PLAYLIST: {playlistName ? playlistName.toUpperCase() : "NONE"} </p>
                </div>

                {!isLoading  && <h2>LOADING...</h2> }
            </main>
        </>
    )
}

function Playlist({item, id, selected, onClick} ){
    return (
        <section className={"playlist"} onClick={onClick}>

            <div className={`img-box ${selected === id ? 'selected-playlist' : ""}`} id={`${id}`}>
                <img src={item.src} alt={"playlist img"}/>
            </div>
            <h3>{item.title}</h3>
        </section>
    );
}