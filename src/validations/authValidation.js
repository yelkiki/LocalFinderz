import joi from "joi"

export const registerValid = {
    body: joi.object().required().keys({
        firstname: joi.string().required(),
        lastname: joi.string().required(),
        password: joi.string().required().min(8).regex(/^[a-zA-Z0-9]+$/),
        cPassword: joi.string().required().valid(joi.ref("password")),
        email: joi.string().email().required(),
        phone: joi.number().required(),
        address: joi.string().required()
    })
}
export const loginValid = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
        password: joi.string().required().min(8).regex(/^[a-zA-Z0-9]+$/),  
    })
}

