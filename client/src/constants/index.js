const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
const USERS_API_URL = `${API_URL}/api/users`;
const PRODUCTS_API_URL = `${API_URL}/api/products`;
const GET_PRODUCTS_BY_CATEGORY = `${API_URL}/api/products_by_category`;
const ADD_PRODUCT_TO_CART = `${API_URL}/api/add_product_to_cart`;
const REMOVE_PRODUCT_FROM_CART = `${API_URL}/api/remove_product_from_cart`;

const CHECKOUT = `${API_URL}/api/checkout`;

const LOGIN_URL = `${API_URL}/api/login`;
const IS_SUPER_USER = `${API_URL}/api/is_super_user`;
//const GET_USERS_API = `${API_URL}/api/users2`;

const SUBMIT_REVIEW= `${API_URL}/api/submit_review`;
const CHATBOT = `${API_URL}/api/chatbot`;

export { API_URL, USERS_API_URL, PRODUCTS_API_URL, LOGIN_URL, IS_SUPER_USER, GET_PRODUCTS_BY_CATEGORY, ADD_PRODUCT_TO_CART, REMOVE_PRODUCT_FROM_CART, CHECKOUT, SUBMIT_REVIEW, CHATBOT };
