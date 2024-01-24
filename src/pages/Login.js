import Header from "../components/Header"
import Login from "../components/Login"

export default function LoginPage(){
    return(
        <>
             <Header
                className="mx-auto my-4"
                heading="Login to your account Rotasia"
                paragraph="Rotasia Don't have an account yet? "
                linkName="Signup"
                linkUrl="/signup"
                />
            <Login/>
        </>
    )
}