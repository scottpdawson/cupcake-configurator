export const config = {
    emailjs: {
        serviceID: 'default_service',
        templateID: process.env.REACT_APP_EMAILJS_TEMPLATE_ID, 
        userID: process.env.REACT_APP_EMAILJS_USER_ID
    }
}