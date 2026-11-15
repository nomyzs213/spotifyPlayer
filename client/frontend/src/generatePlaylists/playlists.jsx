import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import "../../styles/general.css";
import "./playlists.css";
import "../../styles/scrollbar.css";
import {testPlaylists} from "./testData.js";
import {useState} from "react";
import {useLikedSongs} from "../../custom_hooks/usePlaylists.js";
import {useRedirectLoggedOutUser} from "../../custom_hooks/sessionData.js";
import likedSongsImg from "./liked_songs.svg";
import {useMediaQuery} from "@uidotdev/usehooks";
import "../../styles/more-button.css";

export const Playlists = () => {
    // const [isLoading] = useRedirectLoggedOutUser();
    const [selected, setSelected] = useState([]);
    const [playlistNames, setNames] = useState([]);
    const [error, setError] = useState(null);
    // const [isLoading2, hasLikedSongs] = useLikedSongs();
    // poki nie ma sesji dziajacacych to ignoruje to bo sie nie laduje
    const [isLoading2, hasLikedSongs] = [false , true];

    const moods = ["energetic" , "chill" , "sad" , "happy"];
    const isPhone = useMediaQuery("only screen and (max-width: 768px)")
    const [showAllPlaylists, setShowAllPlaylists] = useState(false);

    const isLoading = false;
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

    const likedSongsObj = {
        id: "#mcxppd3032",
        // losowa wartość - byle dzialało a spotify nie ma szans ze zwroci w takim formacie jak to
        title: "liked songs",
        src: likedSongsImg
    }

    return(
        <>
            {!showAllPlaylists && <TopMenu/>}
            {isLoading || isLoading2 &&  <h1>LOADING...</h1>}
            {!isLoading && !isLoading2 && <main>

                { (!isPhone || (isPhone && showAllPlaylists) )&&
                    <PlaylistContainer
                        playlists={testPlaylists}
                        hasLikedSongs={hasLikedSongs}
                        setFunction={updateSelected}
                        selected={selected}
                        likedSongs={likedSongsObj}
                        isPhone={isPhone}
                        setShowAllPlaylists={setShowAllPlaylists}
                    />
                }

                {isPhone && !showAllPlaylists && <
                    MobileCompressedPlaylists
                    hasLikedSongs={hasLikedSongs}
                    setFunction={updateSelected}
                    playlists={testPlaylists}
                    selected={selected}
                    likedSongs={likedSongsObj}
                    setShowAllPlaylists={setShowAllPlaylists}
                />
                }

                <GeneratePlaylistForm moods={moods} playlistNames={playlistNames}/>

            </main>}
        </>
    )
}


const PlaylistContainer = ({hasLikedSongs, setFunction, playlists, selected, likedSongs, isPhone , setShowAllPlaylists}) => {
    return (
        <section className={"playlist-container"}>
            <button className={"close-popup"} onClick={() => setShowAllPlaylists(false)}>X</button>
            <h2>Select playlist</h2>
            <div className={isPhone ? "mobile-playlist-box" : "playlist-box"}>
                {hasLikedSongs && <Playlist item={likedSongs} key={likedSongs.id} id={likedSongs.id} selected={selected} onClick={()=> setFunction(likedSongs)} isLikedSongs={true}/>}
                {playlists.map(p => <Playlist
                    item={p}
                    key={p.id}
                    id={p.id}
                    selected={selected}
                    onClick={() => setFunction(p)}
                    isLikedSongs={false} />)
                }
            </div>
        </section>
    );
}

const MobileCompressedPlaylists = ({hasLikedSongs, setFunction, playlists, selected, likedSongs ,setShowAllPlaylists}) => {
    return (
        <section>
            <h2>Select playlist</h2>
            <div className={"mobile-compressed"}>
                {hasLikedSongs && <Playlist item={likedSongs} key={likedSongs.id} id={likedSongs.id} selected={selected} onClick={()=> setFunction(likedSongs)} isLikedSongs={true}/>}
                {playlists.slice(0, 2).map(p =>
                    <Playlist
                        key={p.id}
                        item={p}
                        id={p.id}
                        selected={selected}
                        onClick={() => setFunction(p)}
                    />
                )}
            </div>
            <button onClick={() => setShowAllPlaylists(true)} className={"mobile-more-btn"}>see all playlists</button>
        </section>
    )
}
const Playlist = ({item, id, selected, onClick, isLikedSongs})=> {

    return (
        <section className={"playlist"} onClick={onClick}>
            <div className={`img-box ${selected.includes(id) ? 'selected-playlist' : ""}`} id={`${id}`}>
                <img src={item.src} alt={"playlist img"} loading={"lazy"}/>
            </div>
            <div className={"playlist-info"}>
                <p hidden={isLikedSongs}>{item.songCount} items</p>
                <h3>{item.title}</h3>
            </div>
        </section>
    );
}

const GeneratePlaylistForm = ({moods, playlistNames}) => {
    return (
        <div>
            <section className={`creation-menu`}>
                <label>UNIQUE playlist name<input type={"text"} placeholder={"playlist name..."} autoComplete={"off"} name={"playlist-name"}/></label>
                <label>select mood <select name={"select-mood"}>
                    {moods.map(m => <option key={m}>{m}</option>)}
                </select></label>
                <button className={"action-btn"}>GENERATE PLAYLIST</button>
            </section>

            <div className={"select-box"}>SELECTED PLAYLISTS: {playlistNames.length> 0 ? playlistNames.map(n => <p>{n}</p>) : "NONE"} </div>
        </div>
    );

}