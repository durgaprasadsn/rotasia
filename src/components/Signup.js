import { useState } from 'react';
import { signupFields } from "../constants/formFields"
import FormAction from "./FormAction";
import Input from "./Input";
import { signUp, insert } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const fields=signupFields;
let fieldsState={};

fields.forEach(field => fieldsState[field.id]='');

export default function Signup(){
  const navigate = useNavigate();
  const [signupState,setSignupState]=useState(fieldsState);
  const [error, setError] = useState(null);

  const handleChange=(e)=>setSignupState({...signupState,[e.target.id]:e.target.value});

  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log(signupState)
    createAccount()
  }

  //handle Signup API Integration here
  async function createAccount(){
    try {
      setError(null);
      var email, password, confirmpassword;
      
      for (const [key, value] of Object.entries(signupState)) {
          if (key === 'emailaddress') {
              email = value;
          }
          if (key === 'password') {
              password = value;
          }
          if (key === 'confirmpassword') {
              confirmpassword = value;
          }
      }
      if (password === confirmpassword) {
        const user = await signUp(email, password);
        console.log(user.email);
        navigate('/');
        var json = {email: user.email};
        insert('/users/' + user.uid, json);
      } else {
        setError("Password not matching");
        throw new Error("Error password not matching");
      }
    } catch(error) {
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
                            value={signupState[field.id]}
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
          <FormAction handleSubmit={handleSubmit} text="Signup" />
        </div>
      </form>
      </>
    )
}