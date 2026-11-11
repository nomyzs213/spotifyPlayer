import "../../styles/general.css";
import "./dashboard.css";
import "../../styles/scrollbar.css";

import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import testData from "./testData.js";
import {useRedirectLoggedOutUser} from "../../custom_hooks/sessionData.js";
import {useMediaQuery} from "@uidotdev/usehooks";
import {useState ,useId} from "react";

export const Dashboard = () => {
    // const [isLoading] = useRedirectLoggedOutUser();
    const artists = testData.compressedTopItems.artists;
    const tracks = testData.compressedTopItems.tracks;
    // const [isLoading ,userData] = useGetDataOrRedirect();
    const isLoading = false;
    const isPhone = useMediaQuery("only screen and (max-width: 768px)");
    const [moreSongsOpened , setMoreSongsOpened] = useState(null);
    const [moreArtistsOpened, setMoreArtistsOpened] = useState(null);
    return (
        <>
            {!moreArtistsOpened && !moreSongsOpened && <TopMenu/>}
            {isLoading && <h1> LOADING...</h1>}
            {!isLoading && !isPhone && <main>
                <ListeningPeriod periodName={"LAST MONTH"} artists={artists.shortTerm} songs={tracks.shortTerm}/>
                <ListeningPeriod periodName={"LAST 6 MONTHS"} artists={artists.mediumTerm} songs={tracks.mediumTerm}/>
                <ListeningPeriod periodName={"LAST YEAR "} artists={artists.longTerm} songs={tracks.longTerm}/>
            </main>
            }

            {!isLoading && isPhone &&
                <main>

                    <MobileTopItems
                        periodName={"LAST MONTH"}
                        artists={artists.shortTerm}
                        songs={tracks.shortTerm}
                        setMoreSongsOpened={setMoreSongsOpened}
                        setMoreArtistsOpened={setMoreArtistsOpened}
                    />

                    <MobileTopItems
                        periodName={"LAST 6 MONTHS"}
                        artists={artists.mediumTerm}
                        songs={tracks.mediumTerm}
                        setMoreSongsOpened={setMoreSongsOpened}
                        setMoreArtistsOpened={setMoreArtistsOpened}
                    />

                    <MobileTopItems
                        periodName={"LAST YEAR"}
                        artists={artists.longTerm}
                        songs={tracks.longTerm}
                        setMoreSongsOpened={setMoreSongsOpened}
                        setMoreArtistsOpened={setMoreArtistsOpened}
                    />

                    {/*SONGS*/}

                    {moreSongsOpened === "last-month" && (
                        <MobileItemList
                            items={tracks.shortTerm}
                            setMoreSongsOpened={setMoreSongsOpened}
                            setMoreArtistsOpened={setMoreArtistsOpened}
                            isSongsList={true}
                        />
                    )}
                    {moreSongsOpened === "last-6-months" && (
                        <MobileItemList
                            items={tracks.mediumTerm}
                            setMoreSongsOpened={setMoreSongsOpened}
                            setMoreArtistsOpened={setMoreArtistsOpened}
                            isSongsList={true}
                        />
                    )}
                    {moreSongsOpened === "last-year" && (
                        <MobileItemList
                            items={tracks.longTerm}
                            setMoreSongsOpened={setMoreSongsOpened}
                            setMoreArtistsOpened={setMoreArtistsOpened}
                            isSongsList={true}
                        />
                    )}

                    {/*ARTISTS*/}

                    {moreArtistsOpened === "last-month" && (
                        <MobileItemList
                            items={artists.shortTerm}
                            setMoreSongsOpened={setMoreSongsOpened}
                            setMoreArtistsOpened={setMoreArtistsOpened}
                            isSongsList={false}
                        />
                    )}
                    {moreArtistsOpened === "last-6-months" && (
                        <MobileItemList
                            items={artists.mediumTerm}
                            setMoreSongsOpened={setMoreSongsOpened}
                            setMoreArtistsOpened={setMoreArtistsOpened}
                            isSongsList={false}
                        />
                    )}
                    {moreArtistsOpened === "last-year" && (
                        <MobileItemList
                            items={artists.longTerm}
                            setMoreSongsOpened={setMoreSongsOpened}
                            setMoreArtistsOpened={setMoreArtistsOpened}
                            isSongsList={false}
                        />
                    )}

            </main>}
        </>
    )
}

const MobileTopItems = ({periodName ,songs, artists, setMoreSongsOpened , setMoreArtistsOpened}) => {
    const periodReplaced = periodName.trimStart().trimEnd().replaceAll(" ", "-").toLowerCase();
    return(
        <>
            <h2>{periodName}</h2>
            <div className={"period-item"}>
                <h3>Top songs</h3>
                <Song song={songs[0]}/>
                <button className={"see-more"} onClick={()=> setMoreSongsOpened(periodReplaced)}>see more songs</button>
            </div>

            <div className={"period-item"}>
                <h3>Top artists</h3>
                <Artist artist={artists[0]}/>
                <button className={"see-more"}  onClick={()=> setMoreArtistsOpened(periodReplaced)}>see more artists</button>
            </div>
        </>
    )
}

const MobileItemList = ({items , setMoreSongsOpened , setMoreArtistsOpened , isSongsList}) => {
    const closePopup = () => {
        if(isSongsList) setMoreSongsOpened(() => null)
        else setMoreArtistsOpened(() => null)
    }

    return(
        <>
            <div className={"mobile-items"}>
                <button onClick={() => closePopup()} className={"close-popup"}>X</button>
                <section className={"mobile-items-container"}>
                    {isSongsList && <h3>TOP SONGS</h3>}
                    {!isSongsList && <h3>TOP ARTISTS</h3>}
                    {isSongsList && items.map(obj => <Song song={obj} key={`${obj.name}-${obj.position}`}/>)}
                    {!isSongsList && items.map(obj => <Artist artist={obj} key={`${obj.name}-${obj.position}`}/>)}
                </section>
            </div>

        </>
    )
}
const ListeningPeriod = ({periodName , artists , songs}) => {
    return (
        <>
            <section className={"period-container"}>
                <h2>{periodName}</h2>

                <div className={"content-container"}>
                    <section className={"top-artists stats-container"}>
                        <h2>ARTISTS</h2>
                        {artists.map(obj => <Artist artist={obj} key={`${obj.name}-${obj.position}`}/>)}
                    </section>

                    <section className={"top-songs stats-container"}>
                        <h2>SONGS</h2>
                        {songs.map(obj => <Song song={obj} key={`${obj.name}-${obj.position}`}/>)}
                    </section>
                </div>

            </section>

        </>
    )
}

const Artist = ({artist}) => {
    return (
        <>
            <div className={"artist-box"}>
                <div className={"artist"}>
                    <section>
                        <h3>{`${artist.position}.`} {artist.name}</h3>
                        <a href={artist.spotifyLink}  target={"_blank"} className={"spotify-link"}>see on Spotify</a>
                    </section>
                    <img src={artist.image} alt={"artist profile img"} loading={"lazy"}/>
                </div>

            </div>
        </>
    )
}

const Song = ({song}) => {
    const artists = song.artists.join(",");

    return (
        <>
            <div className={"song-box"}>
                <div className={"song"}>
                    <section>
                        <h3 className={"track-title"}>{`${song.position}.`}{song.name} - {artists}</h3>
                        <a href={song.spotifyLink} target={"_blank"} className={"spotify-link"}>see on Spotify</a>
                    </section>
                    <div className={"img-box"}> <img src={song.image} alt={"song image"} loading={"lazy"}/> </div>
                </div>

            </div>


        </>
    )
}