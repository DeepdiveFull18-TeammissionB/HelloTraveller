package com.hellotraveller.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GuestOrderRequest {
    private String name;
    private String email;
    private String orderNo;
}
