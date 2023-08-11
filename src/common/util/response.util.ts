// success, fail 메세지 가공
const util = {
  success: (status: number, data?: any) => {
    return {
      status,
      data,
    };
  },
  fail: (status: number, returnObj: Record<string, any>) => {
    return {
      status,
      ...returnObj,
    };
  },
};

export default util;
