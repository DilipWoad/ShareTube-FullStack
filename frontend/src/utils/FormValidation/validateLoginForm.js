import { emailRegex, passwordRegex } from "../constant";

export const validateLoginForm=(form)=>{

    console.log("reached Here : ",form)
    const isValidEmail = emailRegex.test(form.email);
    // const isValidPassword = passwordRegex.test(form.password);
    console.log(isValidEmail)
    return isValidEmail;
}
