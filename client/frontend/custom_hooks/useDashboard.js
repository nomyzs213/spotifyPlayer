import {useState ,useEffect} from "react";

export const useDashboard = () =>{
    const [isLoading, setIsLoading] = useState(false);
    const [dashboardData , setDashboardData] = useState(null);


    useEffect(() => {
        const load = async () => {
            const response = await fetch('/api/dashboard')
            const data = await response.json();

            if(data.redirectError) {
                window.location.href = `/htmls/errors/${data.error.status}.html`;
                return;
            }
            setDashboardData(data)
            setIsLoading(false)
        }
    }, []);
    return [isLoading, dashboardData];
}