import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email:'',
        password:'',
    })

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/api/auth/login', formData);
            login(res.data.token, res.data.user);
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.error || 'Login error')
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                <input name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange}/>
                <button type='submit'>Login</button>
            </form>
        </div>
    );
};

export default Login;