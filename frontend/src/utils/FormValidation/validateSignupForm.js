import { emailRegex, passwordRegex } from "../constant";

export const validateSignupForm=(formData)=>{
    console.log("reached Here : ",formData)
    const isValidEmail = emailRegex.test(formData.email);
    const isValidPassword = passwordRegex.test(formData.password);
    console.log(isValidEmail)
    return {isValidEmail,isValidPassword};
}
