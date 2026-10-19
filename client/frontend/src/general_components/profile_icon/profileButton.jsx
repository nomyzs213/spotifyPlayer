import "./style.css";

export const ProfileButton = (src) => {
    return(
        <>
            <div className={"user-icon-container"}>
                <img src={src} alt={"user-icon"}/>
            </div>
        </>
    )
}