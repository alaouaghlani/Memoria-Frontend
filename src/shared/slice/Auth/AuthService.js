import { BaseURI } from "../..";
import { Executor } from "../../Executor";

export const login = (data) => {
    return Executor({
        method: 'post',
        data,
        url: BaseURI + '/memoria/signin',
        isSilent: false,
        successFun: (data) => {
            
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
}
export const signup = (data) => {
    return Executor({
        method: 'post',
        data,
        url: BaseURI + '/memoria/signup',
        isSilent: false,
        successFun: (data) => {
            
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
}


  