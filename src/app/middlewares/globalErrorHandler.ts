/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import AppError from '../errors/AppError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import handleValidationError from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';
import { TErrorSource } from '../interface/error';

const globalErrorHandler: ErrorRequestHandler = (errorDetails, req, res, next) => {
  //setting default values
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  if (errorDetails instanceof ZodError) {
    const simplifiedError = handleZodError(errorDetails);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (errorDetails?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(errorDetails);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (errorDetails?.name === 'CastError') {
    const simplifiedError = handleCastError(errorDetails);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (errorDetails?.code === 11000) {
    const simplifiedError = handleDuplicateError(errorDetails);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (errorDetails instanceof AppError) {
    statusCode = errorDetails?.statusCode;
    message = errorDetails.message;
    errorSources = [
      {
        path: '',
        message: errorDetails?.message,
      },
    ];
  } else if (errorDetails instanceof Error) {
    message = errorDetails.message;
    errorSources = [
      {
        path: '',
        message: errorDetails?.message,
      },
    ];
  }
  const errorMessage = errorSources.map((error) => `${error.path} is ${error.message.toLowerCase()}`).join('. ');
  const formattedErrorMessage = `${errorMessage.charAt(0).toUpperCase()}${errorMessage.slice(1)}.`;
  //ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage: formattedErrorMessage,
    errorDetails,
    stack: config.NODE_ENV === 'development' ? errorDetails?.stack : null,
  });
};

export default globalErrorHandler;

//pattern
/*
success
message
errorSources:[
  path:'',
  message:''
]
stack
*/