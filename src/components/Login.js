import {Cancel, Room} from "@material-ui/icons";
import axios from "axios";
import {useRef, useState} from "react";
import "./login.css";


function Login({setShowLogin, myStorage, setCurrentUser}) {
    const [error, setError] = useState(false);
    const nameRef = useRef()
    const passwordRef = useRef()
    const handleSubmit = async (e) => {
        e.preventDefault()
        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value
        };
        try {
            const res = await axios.post("/users/login", user);
            myStorage.setItem("user", res.data.username)
            setCurrentUser(res.data.username);
            setShowLogin(false);
            setError(false)


        } catch (err) {
            setError(true)
        }
    };
    return (
        <div className="loginContainer">
            <div className="logo">
                <Room className="logoIcon"/>
                <span>Pins</span>
            </div>
            <form onSubmit={handleSubmit}>
                <input autoFocus placeholder="username" ref={nameRef}/>

                <input
                    type="password"
                    min="6"
                    placeholder="password"
                    ref={passwordRef}
                />
                <button className="loginBtn" type="submit">
                    Login
                </button>
                {error && <span className="failure">Wrong.Try again!</span>}
            </form>
            <Cancel
                className="loginCancel"
                onClick={() => setShowLogin(false)}
            />
        </div>
    )
}

export default Login;