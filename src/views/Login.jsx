import axiosClient from "../axiosClient.js"
import {useRef, useState} from "react";
import {Link, Navigate} from "react-router-dom";
import FormErrors from "../components/FormErrors.jsx"
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Login(){
    const emailRef = useRef()
    const passwordRef = useRef()
    const [errors, setErrors] = useState(null)
    const {setToken, setUser} = useStateContext()
    const loginSubmit = (e) => {
        e.preventDefault()
        const data = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        axiosClient.post("/login", data).then(({data})=>{
            if(data && data.user){
                setUser(data.user)
                setToken(data.token)
            }
        }).catch(err =>{
            const response = err.response;
            if(response && response.status == 422){
                var errors = response.data.errors;
                if(errors){
                    const allErrors = Object.values(errors).flat();
                    setErrors(allErrors)
                }
            }
        })
    }
    return (
        <div className="full-center">
            <form className="fcy-form fade-in" onSubmit={loginSubmit}>
                <h1 className="text-center">Login</h1>
                {
                    errors && <FormErrors errors={errors} />
                }
                <input ref={emailRef} className="fcy-input" type="email" placeholder="Email"/>
                <input ref={passwordRef} className="fcy-input" type="password" placeholder="Password"/>
                <button className="btn-purple">Login</button>
                <div className="mt-2">
                    Don't have an account? <Link to="/signup">Regsiter now</Link>
                </div>
            </form>
        </div>
    )
}