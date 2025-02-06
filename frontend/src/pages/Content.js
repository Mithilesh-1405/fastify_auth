import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import axios from 'axios';

function Content() {
    const navigate = useNavigate();
    const privateRoute = async () => {
        const refreshToken = Cookies.get('refreshToken');
        try {
            const response = await axios.get('http://localhost:9666/users/private', {
                withCredentials: true
            });
            console.log(response)

        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        if (!accessToken) {
            privateRoute()
        }
    }, [])
    return (
        <div>
            <p>protected Route</p>
        </div>
    )
}

export default Content
