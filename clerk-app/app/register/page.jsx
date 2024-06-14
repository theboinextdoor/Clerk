"use client"
import React from 'react'
import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const RegisterPage = () => {
     const { isLoaded, signUp, setActive } = useSignUp();
     const [pendingVarification, setPendingVarification] = useState(false);
     const [code, setCode] = useState('');
     const router = useRouter();
     const [userInput, setUserInput] = useState({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: ""
     });


     // Input Change
     const handleOnChange = (event) => {
          const { name, value } = event.target;
          if (name) {
              
               setUserInput((prev) => {
                    return {
                         ...prev,
                         [name]: value
                    };
               });
          }else{
               console.log("There is an error....")
          }
     }

     // Form Submit with Basic Validation
     const handleSubmit = async (e) => {
          e.preventDefault();

          // Basic validation
          if (!userInput.email || !userInput.password || !userInput.firstName || !userInput.lastName) {
               console.error("Missing required fields. Please fill all fields.");
               return;
          }

          // if (userInput.password !== userInput.confirmPassword) {
          //      console.error("Passwords do not match. Please re-enter your password.");
          //      return;
          // }

          try {
               console.log(userInput);
               const signUpResponse = await signUp.create({
                    emailAddress: userInput.email,
                    password: userInput.password,
                    firstName: userInput.firstName,
                    lastName: userInput.lastName,
                    });
                    
                    console.log("SignUp Response : " , signUpResponse)
                    
                    // Verfiying the Email address
                    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
                    setPendingVarification(true);
          } catch (error) {
               console.error(error);
          }
     };

     // Verify User Email Code
     const onPressVerify = async (e) => {
          e.preventDefault();

          if (!isLoaded || !code) {
               return;
          }

          try {
               const completeSignUp = await signUp.attemptEmailAddressVerification({
                    code,
               });

               if (completeSignUp.status !== 'complete') {
                    console.log(JSON.stringify(completeSignUp, null, 2));
                    return; // Handle unsuccessful verification
               }

               await setActive({
                    session: completeSignUp.createdSessionId
               });
               router.push('/'); // Redirect to home page on successful verification
          } catch (error) {
               console.error(error);
          }
     };
     return (
          <div className="border p-5 rounded-xl bg-gray-100 max-w-full">
               <div className="flex items-center justify-center">
                    <h1 className="text-2xl mb-4 font-medium text-secondary">Register</h1>
               </div>

               {pendingVarification ? (<form className="space-y-4 md:space-y-6">
                    <input
                         type="text"
                         value={code}
                         className="bg-gray-100 border-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                         placeholder="Enter Varification Code..."
                         onChange={(e) => setCode(e.target.value)}
                    />
                    <button
                         type="submit"
                         onClick={onPressVerify}
                         className="w-full text-white bg-primary hover:bg-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                         Verify Email
                    </button>
               </form>) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
                         <div className="flex items-start gap-3">
                              <div className="flex flex-col items-start gap-2">
                                   <label htmlFor="firstName" className="block mb-1 font-medium">
                                        First Name :
                                   </label>
                                   <input
                                        required
                                        type="text"
                                        value={userInput.firstName}
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Enter Your First Name"
                                        className="border py-2 px-1 w-full rounded-md"
                                        onChange={handleOnChange}
                                   />
                              </div>
                              <div className="flex flex-col items-start gap-2">
                                   <label htmlFor="lastName" className="block mb-1 font-medium">
                                        Last Name :
                                   </label>
                                   <input
                                        required
                                        type="text"
                                        value={userInput.lastName}
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Enter Your Last Name"
                                        className="border py-2 px-1 w-full rounded-md"
                                        onChange={handleOnChange}
                                   />
                              </div>
                         </div>

                         <div>
                              <label htmlFor="email" className="block mb-1 font-medium">
                                   Email :
                              </label>
                              <input
                                   required
                                   type="email"
                                   id="email"
                                   value={userInput.email}
                                   name="email"
                                   placeholder="Enter Your Email"
                                   className="border py-2 px-1 w-full rounded-md"
                                   onChange={handleOnChange}
                              />
                         </div>

                         <div>
                              <label htmlFor="password" className="block mb-1 font-medium">
                                   Password :
                              </label>
                              <input
                                   required
                                   type="password"
                                   value={userInput.password}
                                   id="password"
                                   name="password"
                                   className="border py-2 px-1 w-full rounded-md"
                                   onChange={handleOnChange}
                              />
                         </div>

                         <div>
                              <label htmlFor="confirmPassword" className="block mb-1 font-medium">
                                   Confirm Password :
                              </label>
                              <input
                                   required
                                   type="password"
                                   id="confirmPassword"
                                   name="confirmPassword"
                                   value={userInput.confirmPassword}
                                   className="border py-2 px-1 w-full rounded-md"
                                   onChange={handleOnChange}
                              />
                         </div>

                         <button
                              type="submit"
                              className="border p-2 bg-primary rounded-lg text-white hover:bg-secondary"
                         >
                              Sign In
                         </button>
                    </form>
               )}


          </div>

     )
}

export default RegisterPage
