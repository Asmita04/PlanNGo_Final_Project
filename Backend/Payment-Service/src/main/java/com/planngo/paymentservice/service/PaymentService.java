package com.planngo.paymentservice.service;

import com.planngo.paymentservice.Repository.PaymentRepository;
import com.planngo.paymentservice.dto.PaymentRequest;
import com.planngo.paymentservice.dto.PaymentResponse;
import com.planngo.paymentservice.dto.PaymentVerificationRequest;
import com.planngo.paymentservice.entities.Payment;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

  private final RazorpayClient razorpayClient;
  private final PaymentRepository paymentRepository;

  @Value("${razorpay.key.id}")
  private String key;

  @Value("${razorpay.key.secret}")
  private String secret;

  Double amount;
  Integer ticketId;

  public PaymentResponse createOrder(PaymentRequest request) throws RazorpayException {

    ticketId = request.getTicketId();
    amount = request.getAmount() * 100;

    JSONObject orderRequest = new JSONObject();
    orderRequest.put("amount", amount); // convert to paise
    orderRequest.put("currency", request.getCurrency());
    orderRequest.put("receipt", "ticket_" + request.getTicketId());

    Order order = razorpayClient.orders.create(orderRequest);
    String order_id = order.get("id");
    log.info("Order created with ID: {}", order_id);

    return PaymentResponse.builder()
            .orderId(order.get("id"))
            .amount(request.getAmount())
            .currency(order.get("currency"))
            .key(key)
            .createdAt(order.get("created_at"))
            .status(order.get("status"))
            .build();
  }


  public boolean verifySignature(PaymentVerificationRequest request) throws RazorpayException {
    String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
    String generatedSignature = Utils.getHash(payload, secret);

    boolean isValid = generatedSignature.equals(request.getRazorpaySignature());
    log.info("Signature verification for Order {}: {}", request.getRazorpayOrderId(), isValid);

    // Save to DB
    savePaymentDetails(request);

    return isValid;
  }

  private void savePaymentDetails(PaymentVerificationRequest request) throws RazorpayException {
    String order_id = request.getRazorpayOrderId();
    Payment payment = Payment.builder()
            .ticketId(ticketId)
            .razorpayOrderId(order_id)
            .amount(amount)
            .currency("INR")
            .status(fetchPaymentStatus(request.getRazorpayPaymentId()))
            .createdDate(LocalDateTime.now())
            .build();

    paymentRepository.save(payment);

    log.info("Payment record saved in DB for Order: {}", order_id);
  }

  public String fetchPaymentStatus(String paymentId) throws RazorpayException {
    com.razorpay.Payment payment = razorpayClient.payments.fetch(paymentId);
    String status = payment.get("status");
    log.info("Fetched payment status for {}: {}", paymentId, status);
    return status;
  }
}