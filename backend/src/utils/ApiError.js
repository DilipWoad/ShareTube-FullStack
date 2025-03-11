class ApiError extends Error {
    //as soon as ApiError instance/obj is created use the below constructor
    //means apiError will take some arguments
    constructor(
        message = "Something Went Wrong!!",
        statusCode,
        errors = [],
        stack = ""
    ){
        super(message); //this means the error coming from the Error class
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        // if(stack){
        //     this.stack = stack
        // }else{
        //     Error.stackTraceLimit(this,this.constructor)
        // }
    }
}
export {ApiError};