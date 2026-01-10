import axiosClient from "../axiosClient.js"
import {useRef, useState} from "react";
import {Link, Navigate} from "react-router-dom";
import FormErrors from "../components/FormErrors.jsx"
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {ClipLoader} from "react-spinners";

export default function Login(){
    const emailRef = useRef()
    const passwordRef = useRef()
    const [errors, setErrors] = useState(null)
    const {setToken, setUser} = useStateContext()
    
    const [loading, setLoading] = useState(false)
    const loginSubmit = (e) => {
        e.preventDefault()
        const data = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        setLoading(true)
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
        }).finally(()=>{
            setLoading(false)
        })
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
                <form className="fcy-form translucent fade-in" onSubmit={loginSubmit}>
                    <div className="form-header">
                        <h1 className="text-center">Minteract</h1>
                        <p>Start mingling and interacting with other people!</p>
                    </div>
                    {
                        errors && <FormErrors errors={errors}/>
                    }
                    <input ref={emailRef} className="fcy-input" type="email" placeholder="Email"/>
                    <input ref={passwordRef} className="fcy-input" type="password" placeholder="Password"/>
                    <button className="btn-purple">Login</button>
                    <div className="mt-2">
                        Don't have an account? <Link to="/signup">Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}