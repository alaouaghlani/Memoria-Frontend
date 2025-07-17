import { store } from "."; // Assuming this imports the Redux store
import { setRootLoading } from "./slice/rootSlice"; // Assuming this imports an action to set loading state
import Intersptor from "./Intersptor";

export function Executor(config) {
  return new Promise((resolve, reject) => {
    !config.isSilent && store.dispatch(setRootLoading(true)); // Set loading state

    // Set up axios request with custom config, including method, URL, data, headers, and timeout
    Intersptor({
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.head && { ...config.head }, // Include headers if provided
      timeout: config.timeout || 30000, // Use custom timeout if provided, otherwise default to 30s
    })
      .then((res) => {
        // Handle successful response
        const successStatus = res?.status === 200;

        successStatus && config.successFun && config.successFun(res?.data);

        !config.isSilent && store.dispatch(setRootLoading(false)); // Reset loading state

        resolve(res?.data);
      })
      .catch((err) => {
        // Handle errors
        const failedStatus = err?.response?.status === 404;
        // || err?.response?.status === 401 // Add other error codes if needed

        failedStatus && config.errorFun && config.errorFun(err?.response?.data);

        !config.isSilent && store.dispatch(setRootLoading(false)); // Reset loading state

        reject(err);
      });
  });
}
