import {useState, useEffect} from "react";

const usePlaylists = () => {
    const [isLoading, setLoading] = useState(true);
    const [playlists, setPlaylists] = useState(null);
    useEffect(() => {
        void (async () => {
            const response = await fetch("/api/getPlaylists", {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await response.json();
            setPlaylists(data);
            setLoading(false);
        })();
    }, []);
}

export default usePlaylists;