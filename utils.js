
const sendResponse = (res, statusCode, data) => {
    res.status(statusCode).json({
        success: true,
        data
    });
};

const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({
        success: false,
        message
    })
}

const isValidEmail = email => /.+\@.+\..+/.test(email)

const isValidPhoneNumber = phoneNumber => /\d{10}/.test(phoneNumber);

const isValidPassword = password => password.length >= 8;

module.exports = {
    sendResponse,
    sendError,
    isValidEmail,
    isValidPhoneNumber,
    isValidPassword
}