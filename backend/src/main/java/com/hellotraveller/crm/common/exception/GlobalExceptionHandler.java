package com.hellotraveller.crm.common.exception;

import com.hellotraveller.crm.common.api.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        String errorMessage = "잘못된 입력값입니다.";

        var fieldError = bindingResult.getFieldError();
        if (fieldError != null) {
            errorMessage = fieldError.getDefaultMessage();
        }

        log.warn("[Validation Error] {}", errorMessage);
        return ApiResponse.error(errorMessage);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(RuntimeException.class)
    public ApiResponse<Object> handleRuntimeException(RuntimeException ex) {
        log.warn("[Runtime Exception] {}", ex.getMessage());
        return ApiResponse.error(ex.getMessage()); // 에러 메시지 그대로 반환
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public ApiResponse<Object> handleException(Exception ex) {
        log.error("[Internal Server Error] ", ex); // 전체 스택 트레이스 출력
        ex.printStackTrace(); // 콘솔에 확실하게 찍기
        return ApiResponse.error("서버 내부 오류가 발생했습니다: " + ex.getMessage());
    }
}
