import axios from 'axios';
import { RDS_API_URL_SELF } from './constants.js';

export async function getUserId(response) {
  try {
    return response.data.username;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getRDSUserSelfDetails(rdsCookie = '') {
  try {
    const apiData = {
      status: 500,
      data: {},
    };
    await axios({
      method: 'get',
      url: RDS_API_URL_SELF,
      headers: {
        Cookie: rdsCookie,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          apiData.status = 200;
          apiData.data = response.data;
        }
      })
      .catch((error) => {
        apiData.status = error.response.status;
        apiData.data = error.response.data;
      });
    return apiData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
