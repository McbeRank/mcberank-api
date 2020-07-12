const mongoose = require('mongoose');
const { UnprocessableEntity } = require('http-errors');

function errorHandler(error, req, res, next){
    error = preprocessError(error);
    
    // May have critical errors
    if(error.status == 500){
        logger.error('Internal Server Error (500) occurred while processing request');
        logger.error(`Error Name=${error.name}`);
        logger.error(`Error Message=${error.message}`);
    }

	res.status(error.status).json(error);
}

function preprocessError(error){
    switch(error.name){
        case 'ValidationError':
            error.status = 400;
            break;
        default:
            error.status = error.status || error.statusCode || 500;
    }

    if(error.name == 'ValidationError'){
        for(var e of Object.values(error.errors)){
            switch(e.path){
                case 'ip': e.path = 'host'; break;
                case 'slug': return new UnprocessableEntity(e.message);
            }
            error.errors[e.path] = translateError(e);
            // error.errors[e.path] = {
            //     name: e.name,
            //     message: translateError(e),
            //     kind: e.kind,
            //     path: e.path,
            //     value: e.value
            // };
        }
    }else{
        error.message = translateError(error);
    }
    
    return Object.assign({ name: error.name, message: error.message }, error);
}

function translateError(e){
    switch(e.name){
        case "CastError":
            switch(e.kind){
                case "Number": e.kind = "숫자"; break;
            }
            return `해당 값은 ${e.kind}이어야 합니다.`;
    }
    return e.message;
}

const msg = mongoose.Error.messages;
msg.general.required = '`{PATH}`란을 채워야 합니다.';

msg.Number.min = '`{PATH}`란의 "{VALUE}"는 "{MIN}"보다 작아야 합니다.';
msg.Number.max = '`{PATH}`란의 "{VALUE}"는 "{MIN}"보다 커야 합니다.';
msg.Number.enum = '`{PATH}`란의 "{VALUE}"는 유효한 enum 값이 아닙니다.';

msg.Date.min = '`{PATH}`란의 "{VALUE}"는 "{MIN}"보다 이전이어야 합니다.';
msg.Date.max = '`{PATH}`란의 "{VALUE}"는 "{MIN}"보다 이후이어야 합니다.';

module.exports = errorHandler;