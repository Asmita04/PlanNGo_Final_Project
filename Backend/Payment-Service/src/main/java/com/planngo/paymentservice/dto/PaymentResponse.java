package com.planngo.paymentservice.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class PaymentResponse {

    private String orderId;
    private Double amount;
    private String currency;
    private String key;
    private Date createdAt;
    private String status;
}
