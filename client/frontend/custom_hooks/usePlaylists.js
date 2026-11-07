import {useState, useEffect} from "react";

export const usePlaylists = () => {
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

export const useLikedSongs = () => {
    const [isLoading, setLoading] = useState(true);
    const [hasLikedSongs, setLiked] = useState(null);

    useEffect(() => {
        const load = async () => {
            const response = await fetch("/api/getLikedSongs",{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if(!response.ok) {
                const data = await response.json();
                // redirect tutaj bedzie trzeba zrobic

                return;
            }
            const data = await response.json();
            setLiked(data);
            setLoading(false);
        }

        void load;
    }, []);

    return [isLoading, hasLikedSongs];

}