import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import "./main-site.css";
import "../../styles/general.css"
function App() {

  return (
      <>
        <TopMenu username={"USERNAME"} profileImgSrc={"https://youtube.com"}/>
        <main>
          <h2 className={"main-text"} id={"tilt1"}>SEE YOUR LISTENING STATS</h2>
          <h2 className={"main-text"} id={"tilt2"}>GENERATE PLAYLISTS</h2>
          <h2 className={"main-text"} id={"tilt3"}>CHECK MUSIC PLAYBACK</h2>

            <div className={"redirect-container"}>
              <button className={"register-btn"}><a href={"register"}>register</a></button>
              <a href={"/how"} className={"how"}> HOW THIS WORKS?</a>
            </div>
        </main>

      </>

  )
}

export default App;
