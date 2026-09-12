export  function throwError(errorContent, status){
    const error = new Error(errorContent);
    error.status = status;
    throw error;
}

export function createError(errorContent , status){
    const error = new Error(errorContent);
    error.status = status;
    return error;
}