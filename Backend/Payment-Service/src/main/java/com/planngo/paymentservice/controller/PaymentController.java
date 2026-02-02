package com.planngo.paymentservice.controller;

import com.planngo.paymentservice.dto.PaymentRequest;
import com.planngo.paymentservice.dto.PaymentResponse;
import com.planngo.paymentservice.dto.PaymentStatusResponse;
import com.planngo.paymentservice.dto.PaymentVerificationRequest;
import com.planngo.paymentservice.service.PaymentService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-payment-order")
    public ResponseEntity<PaymentResponse> createOrder(
            @RequestBody PaymentRequest dto)
            throws RazorpayException {

        return ResponseEntity.ok(
                paymentService.createOrder(dto));
    }


    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(
            @RequestBody PaymentVerificationRequest request) throws RazorpayException {

        boolean isValid = paymentService.verifySignature(request);

        if (isValid) {
            // save payment as SUCCESS in DB
            return ResponseEntity.ok("Payment verified successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid payment signature");
        }
    }
}
