package com.planngo.paymentservice.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Integer ticketId;;
    private Double amount;
    private String currency;
}
