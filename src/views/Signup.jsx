import {Link} from "react-router-dom";
import {useState, useRef} from "react";
import FormErrors from "../components/FormErrors.jsx";
import axiosClient from "../axiosClient.js";

export default function Signup() {
    const fnameRef = useRef()
    const lnameRef = useRef()
    const emailRef = useRef()
    const passRef = useRef()
    const confirmPassRef = useRef()
    const [errors, setErrors] = useState(null)
    const signupSubmit = (e) => {
        e.preventDefault()
        const payload = {
            first_name: fnameRef.current.value,
            last_name: lnameRef.current.value,
            email: emailRef.current.value,
            password: passRef.current.value,
            password_confirmation: confirmPassRef.current.value
        }
        axiosClient.post("/signup", payload).then(({response}) => {
            
        }).catch(err => {
            const response = err.response;
            if(response && response.status == 422){
                const errors = response.data.errors;
                if(errors){
                    const allErrors = Object.values(errors).flat();
                    setErrors(allErrors)
                }
            }
        });
    }
    
    return (
        <div className="full-center">
            <form className="fcy-form fade-in" onSubmit={signupSubmit}>
                <h1 className="text-center">Register an account</h1>
                {
                    errors && <FormErrors errors={errors} />
                }
                <input ref={fnameRef} type="text" placeholder="First Name"/>
                <input ref={lnameRef} type="text" placeholder="Last Name"/>
                <input ref={emailRef} type="email" placeholder="Email Address"/>
                <input ref={passRef} type="password" placeholder="Password"/>
                <input ref={confirmPassRef} type="password" placeholder="Confirm Password"/>
                <button className="btn-purple">Signup</button>
                <div className="mt-2">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </form>
        </div>
    )
}