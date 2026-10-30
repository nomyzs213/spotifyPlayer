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
            <TopMenu/>
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
                        {artists.map(obj => <Artist artist={obj} key={obj.id}/>)}
                    </section>

                    <section className={"top-songs stats-container"}>
                        <h2>SONGS</h2>
                        {songs.map(obj => <Song song={obj} key={obj.id}/>)}
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
                <div className={"artist"}>
                    <section>
                        <h3>{`${artist.position}.`} {artist.name}</h3>
                        <a href={artist.spotifyLink}  target={"_blank"} className={"spotify-link"}>see on Spotify</a>
                    </section>
                    <img src={artist.image} alt={"artist profile img"}/>
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
                    <div className={"img-box"}> <img src={song.image} alt={"song image"}/> </div>
                </div>

            </div>


        </>
    )
}