import {useState, useEffect} from "react";

export function useRedirectLoggedInUser(){
    const [isLoading , setLoading] = useState(true);

    useEffect( ()=>{
         const load = async () => {
            const response = await fetch("/api/getUserData", {
                credentials: "include",
                method: "POST",
                headers:{"Content-Type": "application/json"},
            });

            const data = await response.json();
            if(data.user) {
                window.location.href = "/api/redirect";
            }
            else setLoading(false);


        }

        load();

    }, []);
    return [isLoading]
}

export function useGetUserData(){
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    useEffect( ()=>{
        const load = async () => {
            const response = await fetch("/api/getUserData", {
                credentials: "include",
                method: "POST",
                headers:{"Content-Type": "application/json"},
            });

            const data = await response.json();
            if(data.user) {
                setUserData(data.user);
            }
            setIsLoading(false);
        }

        load();

    }, [])

    return [isLoading, userData];
}

