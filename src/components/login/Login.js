import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";
import { useHistory } from "react-router"
import axios from "axios"
import LoadingOverlay from 'react-loading-overlay';

const Login = () => {
    const [error, setError] = useState(null);
      const [isLoaded, setIsLoaded] = useState(false);
      const [message, setMessage] = useState(null);
      const [user, setUser] = useState({});
      const [isLoggedIn, setIsLoggedIn] = useState(false);
      let history = useHistory();

  const handleFormSubmit = (e) => {
    setError(null)
    setMessage(null)
    setIsLoggedIn(false)
    setUser({})
      e.preventDefault();
      setIsLoaded(true);
      

      let email = e.target.elements.email?.value;
      let password = e.target.elements.password?.value;

      let encodeString = ''+email+':'+password;
      const encodedString = Buffer.from(encodeString).toString('base64');
    

      axios.get("http://openbeats-daw.us-east-2.elasticbeanstalk.com/login",{headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            'Authorization': 'Basic '+ encodedString
        }}).then((response) => {
            console.log(response)
            if(response.data.status==207){
                setError(response.data.message)
            }
            else if(response.data.message){
                setMessage(response.data.message)
                setUser(response.data.data)
                setIsLoggedIn(true)
                setIsLoaded(false)
                // http://localhost:8655/getUserDetails?emailId=wrong@gmail.com' --header 'Content-Type: application/json' --header 'Authorization: Basic aGFyaXNoQGdtYWlsLmNvbTp0ZXN0' \
                axios.get("http://openbeats-daw.us-east-2.elasticbeanstalk.com/getUserDetails?emailId="+email,{headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ encodedString
            }}).then((response) => {
                if(response.data.status==207){
                    setError(response.data.message);
                    setIsLoaded(false)
                }
                else if(response.data){
                    console.log(response.data);
                    setIsLoaded(false)
                    history.push("/dashboard");
                }
            })
                
            }
            
            setIsLoaded(false)
         })
        .catch((error)=>{
            console.log(error);
            setError(error)
            setIsLoaded(false)
        });
      console.log(email, password);
  };
  return (
    <LoadingOverlay
    active={isLoaded}
    spinner
    text='Please wait...'
    >
      <div className='h-screen flex bg-green-700 flex-col'>
          <div className='bg-green-300 w-full max-w-md m-auto bg-white rounded-lg border border-gr4 shadow-default py-10 px-16'>
              <h1 className='text-2xl font-medium text-primary mt-4 mb-12 text-center'>
                  Log in to your account
              </h1>

              <form onSubmit={handleFormSubmit}>
                  <div>
                      {/* <label htmlFor='email'>Email</label> */}
                      <input
                          type='email'
                          className={`w-full p-2 text-primary border border-gr4 rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='email'
                          placeholder='Email'
                          required
                      />
                  </div>
                  <div>
                      {/* <label htmlFor='password'>Password</label> */}
                      <input
                          type='password'
                          className={`w-full p-2 text-primary border border-gr4 rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                          id='password'
                          placeholder='Password'
                          required
                      />
                  </div>

                  <div className='flex justify-center items-center mt-6'>
                      <button
                          className={`bg-gr3 hover:bg-gr4 text-white font-bold py-2 px-4 rounded`}
                      >
                          Login
                      </button>
                      <div className='p-4'>Not a member? Register <Link to='/signup' className='underline hover:text-gray-400'>here</Link></div>
                  </div>
                  <div className="flex justify-center items-center m-2">
                    <div className="px-4 text-blue-700">{message?"Success! Logged In":""}</div>
                    <div className="px-4 text-color-err">{error?"Login failed! Please check username or password":""}</div>
                </div>
              </form>
          </div>
          <div className=' bg-green-300 w-full max-w-md m-auto bg-white rounded-lg border border-gr4 shadow-default py-10 px-16 flex justify-center items-center mt-6 flex-col'>
            <div>or login using</div>
            <div className='flex flex-row border-gr4'>
              <div className='p-4 hover:text-blue-700'><FontAwesomeIcon icon={['fab', 'apple']} /></div>
              <div className='p-4 hover:text-blue-400'><FontAwesomeIcon icon={['fab', 'spotify']} /></div>
              <div className='p-4 hover:text-blue-400'><FontAwesomeIcon icon={['fab', 'google']} /></div>
            </div>
          </div>
      </div>
      </LoadingOverlay>
  );
};

export default Login;
