import { BaseURI } from '../..';
import { Executor } from '../../Executor';

export const getOlderAdultRequest = id => {
  return Executor({
    method: 'get',
    url: BaseURI + `/memoria/getoldersfromidclose/${id}`,
    isSilent: false,
    successFun: data => {},
    withErrorToast: false,
    withSuccessToast: false,
  });
};

export const updateOlderRequest = (data) => {
  return Executor({
    method: 'post',
    data,
    url: BaseURI + `/memoria/updateheir`,
    isSilent: false,
    successFun: data => {},
    withErrorToast: false,
    withSuccessToast: false,
  });
};

export const updateConsent = (data) => {
  return Executor({
    method: 'put',
    data,
    url: BaseURI + `/memoria/updateconsent`,
    isSilent: false,
    successFun: data => {},
    withErrorToast: false,
    withSuccessToast: false,
  });
};

export const updateCloseProfile = (data) => {
  return Executor({
    method: 'put',
    data,
    url: BaseURI + `/memoria/updatecloseprofile`,
    isSilent: false,
    successFun: data => {},
    withErrorToast: false,
    withSuccessToast: false,
  });
};


export const getDeceasedInvitations = id => {
  return Executor({
    method: 'get',
    url: BaseURI + `/memoria/getDeceasedInvitationsByCloseId/${id}`,
    isSilent: false,
    successFun: data => {},
    withErrorToast: false,
    withSuccessToast: false,
  });
};

export const updateDeceasedStatus = (data) => {
  return Executor({
    method: 'put',
    data,
    url: BaseURI + `/memoria/updatedeceasedstatus`,
    isSilent: false,
    successFun: data => {},
    withErrorToast: false,
    withSuccessToast: false,
  });
};

export const getDeceasedHistory = id => {
  return Executor({
    method: 'get',
    url: BaseURI + `/memoria/deceasedrequesthistory/${id}`,
    isSilent: false,
    successFun: data => {},
    withErrorToast: false,
    withSuccessToast: false,
  });
};

export const getRequestAdultHistory = id => {
  return Executor({
    method: 'get',
    url: BaseURI + `/memoria/getrequesthistory/close/${id}`,
    isSilent: false,
    successFun: data => {},
    withErrorToast: false,
    withSuccessToast: false,
  });
};

export const updatefcmtoken = (data) => {
  return Executor({
    method: 'put',
    data,
    url: BaseURI + `/memoria/updatefcmtoken`,
    isSilent: false,
    successFun: data => {},
    withErrorToast: false,
    withSuccessToast: false,
  });
};