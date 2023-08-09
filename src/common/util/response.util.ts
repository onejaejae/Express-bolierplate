// success, fail 메세지 가공
const util = {
  success: (status: number, data?: any) => {
    return {
      status,
      data,
    };
  },
  fail: (status: number, message: string) => {
    return {
      status,
      message,
    };
  },
};

export default util;
