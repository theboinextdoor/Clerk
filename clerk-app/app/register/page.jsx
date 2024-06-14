"use client"
import React from 'react'
import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa6";

const RegisterPage = () => {
     const { isLoaded, signUp, setActive } = useSignUp();
     const [pendingVerification, setPendingVerification] = useState(false);
     const [code, setCode] = useState('');
     const [showPassword, setShowPassword] = useState(false)
     const [showConfirmPassword, setShowConfirmPassword] = useState(false)
     const [passwordLength, setPasswordLength] = useState(false)
     const [passwordMatch, setPasswordMatch] = useState(true)
     const router = useRouter();
     const [userInput, setUserInput] = useState({
          firstName: "",
          lastName: "",
          emailAddress: "",
          password: "",
          confirmPassword: ""
     });

     const handleShowPassword = () => {
          setShowPassword((prev) => !prev)
     }

     const handleShowConfirmPassword = () => {
          setShowConfirmPassword((prev) => !prev)
     }


     // Input Change
     const handleOnChange = (e) => {
          e.preventDefault();
          const { name, value } = e.target;
          if (name) {
               setUserInput((prev) => {
                    return {
                         ...prev,
                         [name]: value
                    };
               });
          }
     }

     // Form Submit with Basic Validation
     const handleSubmit = async (e) => {
          e.preventDefault();

          // Basic validation
          if (!userInput.emailAddress || !userInput.password || !userInput.firstName || !userInput.lastName) {
               return;
          }

          if (userInput.password.length < 7) {
               setPasswordLength(true)
               return;
          }

          if (userInput.password !== userInput.confirmPassword) {
               setPasswordMatch(false)
               return;
          }
          

          try {

               const signUpResponse = await signUp.create({
                    emailAddress: userInput.emailAddress, // Ensure correct field name
                    password: userInput.password,
                    firstName: userInput.firstName,
                    lastName: userInput.lastName,
               });




               await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
               setPendingVerification(true);


               userInput.firstName = ""
               userInput.lastName = ""
               userInput.password = ""
               userInput.confirmPassword = ""
               userInput.emailAddress = ""
          } catch (error) {
               throw new Error(error)
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
                   
                    return; // Handle unsuccessful verification
               }

               await setActive({
                    session: completeSignUp.createdSessionId
               });
               router.push('/'); // Redirect to home page on successful verification
          } catch (error) {
               throw new Error(error)
          }
     };
     return (
          <div className="border p-5 rounded-xl bg-gray-100 max-w-full">
               <div className="flex items-center justify-center">
                    <h1 className="text-2xl mb-4 font-medium text-secondary">Register</h1>
               </div>

               {pendingVerification ? (<form className="space-y-4 md:space-y-6">
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
                              <label htmlFor="emailAddress" className="block mb-1 font-medium">
                                   Email :
                              </label>
                              <input
                                   required
                                   type="email"
                                   id="emailAddress"
                                   value={userInput.emailAddress}
                                   name="emailAddress"
                                   placeholder="Enter Your Email"
                                   className="border py-2 px-1 w-full rounded-md"
                                   onChange={handleOnChange}
                              />
                         </div>

                         <div>
                              <label htmlFor="password" className="block mb-1 font-medium">
                                   Password :
                              </label>
                              <div className='flex flex-col gap-1 '>
                                   <div className='flex items-center relative'>
                                        <input
                                             required
                                             type={showPassword ? "text" : "password"}
                                             value={userInput.password}
                                             id="password"
                                             name="password"
                                             className="border py-2 px-1 w-full rounded-md"
                                             onChange={handleOnChange}
                                        />
                                        <div className='absolute top-2 right-3 cursor-pointer' onClick={handleShowPassword}>
                                             {
                                                  showPassword ? (<FaEyeSlash size={25} />) : (<IoEyeSharp size={25} />)
                                             }

                                        </div>
                                   </div>
                                   {
                                        passwordLength ? (<p className='text-sm text-red-400'>password must be greateer than 8 digit</p>) : ""
                                   }
                              </div>


                         </div>

                         <div>
                              <label htmlFor="confirmPassword" className="block mb-1 font-medium">
                                   Confirm Password :
                              </label>
                              <div className='flex flex-col gap-1'>
                                   <div className='flex items-center relative'>
                                        <input
                                             required
                                             type={showConfirmPassword ? "text" : "password"}
                                             id="confirmPassword"
                                             name="confirmPassword"
                                             value={userInput.confirmPassword}
                                             className="border py-2 px-1 w-full rounded-md"
                                             onChange={handleOnChange}
                                        />
                                        <div className='absolute top-2 right-3 cursor-pointer' onClick={handleShowConfirmPassword}>
                                             {
                                                  showConfirmPassword ? (<FaEyeSlash size={25} />) : (<IoEyeSharp size={25} />)
                                             }

                                        </div>
                                   </div>
                                   {
                                        passwordMatch ? "" : (
                                             <p className='text-red-400 text-sm'>Password didn't match</p>
                                        )
                                   }
                              </div>
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
