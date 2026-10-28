import {useState, useEffect} from "react";


export function useRedirectLoggedInUser(){
    const [isLoading , setLoading] = useState(true);

    useEffect( ()=>{
         const load = async () => {
            const response = await fetch("/api/getUserData", {
                credentials: "include",
                method: "GET",
                headers:{"Content-Type": "application/json"},
            });

            const data = await response.json();
            if(data.user) {
                window.location.href = "/api/redirect";
                return;
            }
            if(data.redirectError) {
                window.location.href = `/htmls/errors/${data.error.status}.html`;
                return;
            }
            setLoading(false);

        }

        void load();

    }, []);
    return [isLoading];
}

export function useRedirectLoggedOutUser(){
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const response = await fetch("/api/getUserData" , {
                credentials: "include",
                method:  "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            const path = "index";

            if(!data.user){
                window.location.href = `/api/redirect?${path}`;
            }

            setLoading(false);
        }
    }, []);

    return [isLoading];
}
export function useGetDataOrRedirect(url){
    const [isLoading , setLoading] = useState(true);
    const [userData , setUserData] = useState(null);

    useEffect( ()=>{
        const load = async () => {
            const response = await fetch("/api/getProfileData", {
                credentials: "include",
                method: "POST",
                headers:{"Content-Type": "application/json"},
            });

            const data = await response.json();
            if(!data) {
                window.location.href = `/api/redirect`;
                return;
            }
                setLoading(false);
                setUserData(data);
        }

        void load();

    }, []);
    return [isLoading, userData];
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

                if(data.user) {
                    setUserData(data.user);
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


