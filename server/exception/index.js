const { ConnectionError } = require("mssql")

exports.handleExceptionInResponse = (res,err) => {
    console.log(err);
    if(err instanceof ConnectionError)
    {
        return res.sendStatus(500);
    }


    if(err instanceof Error)
    {
        return res.status(408).json(
            {
                message: err.message
            }
        )
    }

    return res.sendStatus(408);
        
}