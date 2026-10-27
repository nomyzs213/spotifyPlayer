import {useGetDataOrRedirect, useRedirectLoggedOutUser} from "../../custom_hooks/sessionData.js";
import {TopMenu} from "../general_components/top_menu/topMenu.jsx";
import "../../styles/general.css";
export const playlists = () => {
    const [isLoading, userData] = useGetDataOrRedirect();

    return(
        <>
            <TopMenu username={userData.username} profileImgSrc={userData.imageUrl} isLoading={isLoading} loggedIn={!!userData}/>
            <main>


            </main>
        </>
    )
}


function playlist({item}){
    return (
        <>
            <section className={"playlist"}>
                <img src={item.src} alt={"playlist image"}/>
                <h3>{item.title}</h3>
            </section>
        </>
    );
}