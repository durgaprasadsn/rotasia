const loginFields=[
    {
        labelText:"Email address",
        labelFor:"emailaddress",
        id:"emailaddress",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    }
]

const signupFields=[
    {
        labelText:"Email address",
        labelFor:"emailaddress",
        id:"emailaddress",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    },
    {
        labelText:"Confirm Password",
        labelFor:"confirmpassword",
        id:"confirmpassword",
        name:"confirmpassword",
        type:"password",
        autoComplete:"confirmpassword",
        isRequired:true,
        placeholder:"Confirm Password"   
    }
]

export {loginFields,signupFields}