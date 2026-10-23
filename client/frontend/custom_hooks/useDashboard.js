import {useState ,useEffect} from "react";

export const useDashboard = () =>{
    const [isLoading, setIsLoading] = useState(false);
    const [dashboardData , setDashboardData] = useState(null);


    useEffect(() => {
        const load = async () => {
            const response = await fetch('/api/dashboard')
        }
    }, []);
    return [isLoading, dashboardData];
}