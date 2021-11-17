import { message } from 'antd';

export const handleError = (error, payloadtype) => async (dispatch) => {
  if (error.response) {
    // Request made and server responded
    dispatch({
      type: payloadtype,
      error: error.response.data.message,
    });
    message.error(error.response.data.message.toString());
  } else if (error.request) {
    // The request was made but no response was received
    dispatch({
      type: payloadtype,
      error: error.request,
    });
    message.error(error.request.toString());
  } else {
    // Something happened in setting up the request that triggered an Error
    dispatch({
      type: payloadtype,
      error: error.message,
    });
    message.error(error.message.toString());
  }
};
