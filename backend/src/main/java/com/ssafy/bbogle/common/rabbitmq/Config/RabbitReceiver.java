package com.ssafy.bbogle.common.rabbitmq.Config;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
public class RabbitReceiver {

    @RabbitListener(queues = "responseQueue")
    public void receiveResponse(@Payload String message) {
        System.out.println("Received response: " + message);
    }
}