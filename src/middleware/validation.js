const DBMethod = ['body','params','query','headers'];


const validation = (schema)=>{
    return (req,res,next)=>{
        try {
            let ErrArr = [];
            DBMethod.forEach((key)=>{
                if (schema[key]){
                    const result = schema[key].validate(req[key],{
                        abortEarly: false
                    })
                    if (result?.error?.details){
                        result.error.details.forEach((item)=>{
                            ErrArr.push(item.message);
                        })
                    }
                }
            })
            if (ErrArr.length != 0){
                next({statusCode:400,message:"validation Error",data:ErrArr})
            }
            next();
        } catch (error) {
            next(error)
        }
    }
}

export default validation;