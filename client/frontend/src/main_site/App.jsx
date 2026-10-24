import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import "./main-site.css";
import "../../styles/general.css"
import {useGetUserData} from "../../custom_hooks/sessionData.js";
function App() {


  return (
      <>
        <TopMenu username={"USERNAME"} profileImgSrc={"none"} isLoading={false} loggedIn={false} />
        <main>
          <h2 className={"main-text"} id={"tilt1"}>SEE YOUR LISTENING STATS</h2>
          <h2 className={"main-text"} id={"tilt2"}>GENERATE PLAYLISTS</h2>
          <h2 className={"main-text"} id={"tilt3"}>CHECK MUSIC PLAYBACK</h2>

            <div className={"redirect-container"}>
              <button className={"register-btn"}><a href={"register"}>register</a></button>
              <a href={"/how"} className={"how"} > HOW THIS WORKS?</a>
            </div>
        </main>

      </>

  )
}

export default App;
