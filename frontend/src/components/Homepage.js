import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';


function Homepage() {
    const [accessToken, setToken] = useState('');
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState('')
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setForm((prevFormValue) => ({
            ...prevFormValue,
            [name]: value
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9666/users/login', form, {
                withCredentials: true
            })
            setToken(response.data.accessToken)
            navigate('/protected')
        }
        catch (err) {
            console.log(err)
            setErrors(err.message)
        }
        finally {
            console.log("In finally block")
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name='email' placeholder='Enter your email' onChange={handleChange} />
                <input type="password" name='password' placeholder='Enter your password' onChange={handleChange} />
                <button type='submit'>Submit</button>
            </form>
            <div>Errors: {errors}</div>
        </div>
    )
}

export default Homepage
