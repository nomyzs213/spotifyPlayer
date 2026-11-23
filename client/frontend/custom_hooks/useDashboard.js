import {useState ,useEffect} from "react";

export const useDashboard = (setTracks, setArtists) =>{
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const response = await fetch('/api/dashboard', {
                method: "POST"
            })
            const data = await response.json();
            console.log(data);

            if(data.redirectError) {
                return;
            }
            setTracks(data.compressedTopItems.tracks)
            setArtists(data.compressedTopItems.artists)
            setIsLoading(false);

        }
        void load()
    }, []);
    return [isLoading];
}