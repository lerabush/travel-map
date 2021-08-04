import {Cancel, Room} from "@material-ui/icons";
import axios from "axios";
import {useRef, useState} from "react";
import "./register.css";

function RegisterUser({setShowRegister}) {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const handleSubmit = async (e) => {
        e.preventDefault()
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        };
        try {

            const res = await axios.post("/users/register", newUser);
            setError(false)
            setSuccess(true)

        } catch (err) {
            setError(true)
        }
    };
    return (
        <div className="registerContainer">
            <div className="logo">
                <Room style={{fill: "slateblue"}} className="logoIcon"/>
                <span style={{color: "slateblue"}}>Pins</span>
            </div>
            <form onSubmit={handleSubmit}>
                <input className="registerInputName" autoFocus placeholder="username" ref={nameRef}/>
                <input type="email" placeholder="email" ref={emailRef}/>
                <input
                    type="password"
                    min="6"
                    placeholder="password"
                    ref={passwordRef}
                />
                <button className="registerBtn" type="submit">
                    Register
                </button>
                {success && <span className="success">Successfull!</span>}
                {error && <span className="failure">Wrong.Try again!</span>}
            </form>
            <Cancel
                className="registerCancel"
                onClick={() => setShowRegister(false)}
            />
        </div>
    )
}

export default RegisterUser;