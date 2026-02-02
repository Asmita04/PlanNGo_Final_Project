package com.planngo.paymentservice.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusResponse {

    private String status;              // SUCCESS | FAILED | PENDING
    private String bookingId;

    private String razorpayOrderId;
    private String razorpayPaymentId;

    private Integer amount;
    private String currency;

    private String message;
    private LocalDateTime timestamp;
}
