import request from 'utils/axios';

/**
 * 获取商品列表
 * @returns
 */
export const getVipList = () => {
    return request.post({ url: '/llm/pay/order/product/list' });
};

/**
 * 创建订单
 * @returns
 */
export const createOrder = (data: any) => {
    return request.post({ url: '/llm/pay/order/create', data });
};

/**
 * 创建订单
 * @returns
 */
export const submitOrder = (data: any) => {
    return request.post({ url: '/llm/pay/order/submit', data });
};
