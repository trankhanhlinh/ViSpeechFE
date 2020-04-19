import OrderTypes from './order.types'

const INITIAL_STATE = {
  getList: {
    orderList: { data: [], count: 0 },
    isLoading: false,
    isSuccess: null,
    message: null,
  },
  getInfo: {
    order: {},
    isLoading: false,
    isSuccess: null,
    message: null,
  },
  createOrder: {
    data: {},
    isLoading: false,
    isSuccess: null,
    message: null,
  },
}

const orderReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OrderTypes.CLEAR_ORDER_STATE:
      return {
        ...INITIAL_STATE,
      }
    // GET ORDER LIST
    case OrderTypes.GET_ORDER_LIST:
      return {
        ...state,
        getList: {
          ...state.getList,
          isLoading: true,
        },
      }
    case OrderTypes.GET_ORDER_LIST_SUCCESS:
      return {
        ...state,
        getList: {
          isLoading: false,
          isSuccess: true,
          orderList: action.payload.data,
        },
      }
    case OrderTypes.GET_ORDER_LIST_FAILURE:
      return {
        ...state,
        getList: {
          ...state.getList,
          isLoading: false,
          isSuccess: false,
          message: action.payload,
        },
      }
    // GET ORDER INFO
    case OrderTypes.GET_ORDER_INFO:
      return {
        ...state,
        getInfo: {
          ...state.getInfo,
          isLoading: true,
        },
      }
    case OrderTypes.GET_ORDER_INFO_SUCCESS:
      return {
        ...state,
        getInfo: {
          isLoading: false,
          isSuccess: true,
          order: action.payload.data,
        },
      }
    case OrderTypes.GET_ORDER_INFO_FAILURE:
      return {
        ...state,
        getInfo: {
          ...state.getInfo,
          isLoading: false,
          isSuccess: false,
          message: action.payload,
        },
      }
    // CREATE ORDER
    case OrderTypes.CREATE_ORDER:
      return {
        ...state,
        createOrder: {
          ...state.createOrder,
          isLoading: true,
        },
      }
    case OrderTypes.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        createOrder: {
          isLoading: false,
          isSuccess: true,
          data: action.payload,
        },
      }
    case OrderTypes.CREATE_ORDER_FAILURE:
      return {
        ...state,
        createOrder: {
          ...state.createOrder,
          isLoading: false,
          isSuccess: false,
          message: action.payload,
        },
      }
    default:
      return state
  }
}

export default orderReducer
