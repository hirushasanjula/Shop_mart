const verifyEmailTemplate = ({name, url}) => {
    return `
        <p>Dear ${name}</p>
        <p>Thank you for registering shopmart</p>
        <a href=${url} style="color:white;background-color:blue;margin-top : 10px,padding:20px">
            Verify Email
        </a>
    `
}

export default verifyEmailTemplate;