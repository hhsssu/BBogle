package com.ssafy.bbogle.common.exception;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<String> handleCustomException(CustomException e) {
        HttpStatus statusCode = e.getErrorCode().getStatus();
        String message = e.getErrorCode().getMessage();
        return ResponseEntity.status(statusCode).body(message);
    }

}
