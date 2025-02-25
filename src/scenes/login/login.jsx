import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import carImage from '../../assets/images/v1.webp';
import logo from "../../assets/images/nom.png";
import { useAuth } from '../context/AuthContext'; // Import useAuth

function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Get the login function from useAuth

    const handleLogin = async (e) => {
        e.preventDefault();
        
        console.log("Login data:", { name, password });
      
        try {
            const response = await axios.post("http://localhost:7001/users/login", { name, password });
            if (response.status === 200) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                login(response.data.user.role); // Call the login function
                navigate("/"); // Redirect to home page
            }
        } catch (error) {
            console.error("Login error:", error.response || error);
            setError(error.response?.data?.message || "Une erreur est survenue");
        }
    };
    
    return (
        <div style={styles.login}>
            <div style={styles.loginContainer}>
                <div style={styles.loginLeft}>
                    <img src={carImage} alt="Car" style={styles.carImage} />
                </div>
                <div style={styles.loginRight}>
                    <img src={logo} alt="Logo" style={styles.logo} />
                    <h2 style={styles.brandTitle}>Gestion de location des véhicules</h2>
                    {error && <p style={styles.errorMessage}>{error}</p>}
                    <form onSubmit={handleLogin} style={styles.form}>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            style={styles.inputField}
                            placeholder="Nom d'utilisateur"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            aria-label="Nom d'utilisateur"
                        />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            style={styles.inputField}
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            aria-label="Mot de passe"
                        />
                        <button 
                            type="submit" 
                            style={styles.loginBtn} 
                            aria-label="Se connecter"
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#1c6697'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#5271ff'}
                        >
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    login: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ecf8ff', // Bleu pastel
        fontFamily: "'Montserrat', sans-serif",
    },
    loginContainer: {
        display: 'flex',
        width: '80%', // Increased width to 80% for a more spacious layout
        maxWidth: '1200px', // Larger maxWidth for larger screens
        height: '700px', // Increased height for more vertical space
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)', // Slightly stronger shadow for depth
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        border: '1px solid #dde8f1',
        transform: 'scale(1)',
        transition: 'transform 0.3s ease-in-out',
    },
    loginLeft: {
        flex: 1,
        backgroundImage: `url(${carImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '20px 0 0 20px',
        boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.5)',
    },
    carImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '20px 0 0 20px',
    },
    loginRight: {
        flex: 1,
        padding: '60px 50px', // Increased padding for a more spacious feel
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: '270px', // Increased logo size for more prominence
        height: '270px',
       
    },
    brandTitle: {
        fontSize: '42px', // Increased font size for the title
        fontWeight: '700',
        color: '#1e2a3a',
        marginBottom: '10px', // Increased margin for spacing
        textAlign: 'center',
        letterSpacing: '1px',
    },
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    inputField: {
        width: '80%',
        padding: '18px 22px', // Larger padding for more comfortable input
        margin: '10px 0', // Increased margin between fields
        border: '1px solid #a0c4e8',
        borderRadius: '8px',
        fontSize: '18px',
        fontWeight: '300',
        boxSizing: 'border-box',
        outline: 'none',
        transition: 'border-color 0.3s ease',
    },
    loginBtn: {
        width: '55%', // Increased button width for a more balanced design
        padding: '18px 40px', // Increased padding for a larger button
        backgroundColor: '#5271ff',
        color: '#fff',
        border: 'none',
        borderRadius: '20px',
        fontSize: '22px', // Increased font size for readability
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
    },
    loginBtnHover: {
        backgroundColor: '#1c6697',
        boxShadow: '0 5px 15px rgba(52, 152, 219, 0.5)', 
    },
    errorMessage: {
        color: '#e74c3c',
        marginBottom: '30px', // Increased margin for spacing
        fontSize: '18px', // Increased font size for error message
        textAlign: 'center',
    },
};



export default Login;
