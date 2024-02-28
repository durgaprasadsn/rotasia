import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import Login from "../components/Login"
import Home from "./Home"

export default function LoginPage(){
    const navigate = useNavigate()
    useEffect(() => {
        // console.log("Chck auth " + window.localStorage.getItem("authenticated"));
        if (window.localStorage.getItem("authenticated") == "true") {
            navigate("/home");
        } else {
            navigate("/");
        }
    })
    return(
        <>
            {window.localStorage.getItem("authenticated") == "true" ? 
            <Home /> :
             <>
             <Header
                    className="mx-auto my-4"
                    heading="Login to your account Rotasia"
                    paragraph="Rotasia Don't have an account yet? "
                    linkName="Signup"
                    linkUrl="/signup" />
            <Login />
            </>}
        </>
    )
}