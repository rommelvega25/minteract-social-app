import {Link} from "react-router-dom";
import {useState, useRef} from "react";
import FormErrors from "../components/FormErrors.jsx";
import axiosClient from "../axiosClient.js";
import {ClipLoader} from "react-spinners";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Signup() {
    const {setUser, setToken} = useStateContext()
    const fnameRef = useRef()
    const lnameRef = useRef()
    const emailRef = useRef()
    const passRef = useRef()
    const confirmPassRef = useRef()
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const signupSubmit = (e) => {
        e.preventDefault()
        const payload = {
            first_name: fnameRef.current.value,
            last_name: lnameRef.current.value,
            email: emailRef.current.value,
            password: passRef.current.value,
            password_confirmation: confirmPassRef.current.value
        }
        
        setLoading(true)
        axiosClient.post("/signup", payload).then(({data}) => {
            if(data.user){
                const user = data.user;
                setUser(user);
                setToken(data.token)
            }
        }).catch(err => {
            const response = err.response;
            if(response && response.status == 422){
                const errors = response.data.errors;
                if(errors){
                    const allErrors = Object.values(errors).flat();
                    setErrors(allErrors)
                }
            }
        }).finally(()=>{
            setLoading(false)
        });
    }
    
    return (
        <div className="full-center">
            <div className="wrapper">
                {
                    loading && (
                        <div className="minteract-spinner">
                            <ClipLoader color="gray" loading={loading} size={50} aria-label="Loading Spinner" />
                        </div>
                    )
                }
                <form className="fcy-form translucent fade-in" onSubmit={signupSubmit}>
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
        </div>
    )
}