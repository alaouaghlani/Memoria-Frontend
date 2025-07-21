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

export const forgetPassword = (data) => {
    return Executor({
        method: 'post',
        data,
        url: BaseURI + '/memoria/forgetpassword',
        isSilent: false,
        successFun: (data) => {
            
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
}
export const verifyCode = (data) => {
    return Executor({
        method: 'post',
        data,
        url: BaseURI + '/memoria/verifyCode',
        isSilent: false,
        successFun: (data) => {
            
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
}
export const updatePassword = (data) => {
    return Executor({
        method: 'post',
        data,
        url: BaseURI + '/memoria/updatePassword',
        isSilent: false,
        successFun: (data) => {
            
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
}
export const updateLastActivity = (data) => {
    return Executor({
        method: 'post',
        data,
        url: BaseURI + '/memoria/updatelastactivity',
        isSilent: false,
        successFun: (data) => {
            
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
}

  