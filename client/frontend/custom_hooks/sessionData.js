import {useState, useEffect} from "react";


export function useRedirectLoggedInUser(){
    const [isLoading , setLoading] = useState(true);

    useEffect( ()=>{
         const load = async () => {
            const response = await fetch("/api/getProfileData", {
                credentials: "include",
                method: "POST",
                headers:{"Content-Type": "application/json"},
            });

            const data = await response.json();
            if(data.profile) {
                window.location.href = "/htmls/playback.html";
                return
            }
            setLoading(false)
        }

        void load();

    }, []);
    return [isLoading]
}

export function useRedirectLoggedOutUser(differentFile){
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const response = await fetch("/api/getProfileData" , {
                credentials: "include",
                method:  "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if(!data.profile){
                window.location.href = `/htmls/${differentFile ? differentFile : "index"}.html`;
                setLoading(false);
                return;
            }

            setLoading(false);
        }

        void load();
    }, []);

    return [isLoading];
}

export function useGetUserData(){
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    useEffect( ()=>{
        try{
            const load = async () => {
                const response = await fetch("/api/getProfileData", {
                    credentials: "include",
                    method: "POST",
                    headers:{"Content-Type": "application/json"},
                });

                const data = await response.json();

                if(data.profile) {
                    setUserData(data.profile);
                }
                setIsLoading(false);
            }

            void load();
        }
        catch (err){
            console.error(err);
        }


    }, [])

    return [isLoading, userData];
}


