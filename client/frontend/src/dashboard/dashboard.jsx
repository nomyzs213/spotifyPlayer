import "../../styles/general.css";
import "./dashboard.css"
import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import defaultImage from "../assets/defaultUser.png"
import testData from "./testData.js";


export const Dashboard = () => {

    const artists = testData.compressedTopItems.artists;
    const tracks = testData.compressedTopItems.tracks;
    // const [isLoading ,userData] = useGetDataOrRedirect();
    return (
        <>
            <TopMenu username={"username"} profileImgSrc={defaultImage} isLoading={false}  loggedIn={true}/>
            <main>
                <ListeningPeriod periodName={"LAST MONTH"} artists={artists.shortTerm} songs={tracks.shortTerm}/>
                <ListeningPeriod periodName={"LAST 6 MONTHS"} artists={artists.mediumTerm} songs={tracks.mediumTerm}/>
                <ListeningPeriod periodName={"LAST YEAR "} artists={artists.longTerm} songs={tracks.longTerm}/>
            </main>
        </>
    )
}


const ListeningPeriod = ({periodName , artists , songs}) => {
    return (
        <>
            <div className={"period-container"}>
                <h2>{periodName}</h2>

                <div className={"content-container"}>
                    <section className={"top-artists stats-container"}>
                        <h2>ARTISTS</h2>
                        {artists.map(obj => <Artist artist={obj}/>)}
                    </section>

                    <section className={"top-songs stats-container"}>
                        <h2>SONGS</h2>
                        {songs.map(obj => <Song song={obj}/>)}
                    </section>
                </div>

            </div>

        </>
    )
}

const Artist = ({artist}) => {
    return (
        <>
            <div className={"artist-box"}>
                <section className={"artist"}>
                    <h3>{`${artist.position}.`} {artist.name}</h3>
                    <img src={artist.image} alt={"artist profile img"}/>
                </section>
                <a href={artist.spotifyLink} className={"spotify-link"}>see on Spotify</a>
            </div>
        </>
    )
}

const Song = ({song}) => {
    const artists = song.artists.join(",");

    return (
        <>
            <div className={"song-box"}>
                <section className={"song"}>
                    <h3 className={"track-title"}>{`${song.position}.`}{song.name} - {artists}</h3>
                    <div className={"img-box"}> <img src={song.image} alt={"song image"}/> </div>
                </section>
                <a href={song.spotifyLink} className={"spotify-link"}>see on Spotify</a>
            </div>


        </>
    )
}