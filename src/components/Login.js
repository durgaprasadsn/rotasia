import { useState } from 'react';
import { loginFields } from "../constants/formFields";
import FormAction from "./FormAction";
import Input from "./Input";
import { logIn, isAuthenticated } from "../services/authService";
import { useNavigate } from 'react-router';
import { auth } from '../services/firebase';
import { checkAuthenticated, setAuthenticated } from '../services/preferences';
import { Preferences } from '@capacitor/preferences';

const fields=loginFields;
let fieldsState = {};
fields.forEach(field=>fieldsState[field.id]='');

export default function Login(){
    console.log("Check Authentication " + isAuthenticated());
    const [loginState,setLoginState]=useState(fieldsState);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const handleChange=(e)=>{
        setLoginState({...loginState,[e.target.id]:e.target.value})
    }
    var authentication = window.localStorage.getItem("authenticated")
    
    if (authentication == "true") {
        console.log("Authenticated here ");
        navigate('/home');
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(loginState);
        var email, password;
        for (const [key, value] of Object.entries(loginState)) {
            if (key === 'emailaddress') {
                email = value;
            }
            if (key === 'password') {
                password = value;
            }
        }
        console.log(email, password);
        loginAccount(email, password);
    }

    //handle Login API Integration here
    async function loginAccount(email, password) {
        try {
            setError(null);
            const user = await logIn(email, password);
            // console.log("User " + user.email);
            if (user) {
                console.log(user.email);
                window.localStorage.setItem("authenticated", "true");
                setAuthenticated("true");
                if (user.email === "admin@gmail.com") {
                    navigate("/admin/timeupdate");
                } else {
                    navigate("/home");
                }
            } else {
                window.localStorage.setItem("authenticated", "false");
                setAuthenticated("false");
            }
        } catch (error) {
            console.log(error);
            setError(error.message.replace("Firebase: ", ""));
        }
        
    }

    return(<>
        {error && <p className='flex justify-center' style={{ color: 'red' }}>{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="">
            {
                fields.map(field=>
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={loginState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                    />
                
                )
            }
            <FormAction className="mx-auto" handleSubmit={handleSubmit} text="Login" />
        </div>
      </form>
      </>
    )
}