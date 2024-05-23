

const paginationSize = 10;



const apiResponse = (code, message, data = null) => {
  return {
    code,
    message,
    data,
  };
};



module.exports = {

  paginationSize,
  apiResponse,
};
