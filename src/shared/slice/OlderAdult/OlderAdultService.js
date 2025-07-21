import { BaseURI } from "../..";
import { Executor } from "../../Executor";

export const designateHeirs = (data,id) => {
    return Executor({
        method: 'post',
        data,
        url: BaseURI + `/memoria/designateHeirs/${id}`,
        isSilent: false,
        successFun: (data) => {
            
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
}

  