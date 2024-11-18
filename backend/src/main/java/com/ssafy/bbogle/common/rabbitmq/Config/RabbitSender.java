package com.ssafy.bbogle.common.rabbitmq.Config;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class RabbitSender {

    private final RabbitTemplate rabbitTemplate;


    @Autowired
    public RabbitSender(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendToFastAPI(String queueName, String message) {
        String correlationId = UUID.randomUUID().toString();  // 요청 ID 생성
        rabbitTemplate.convertAndSend(queueName, message, m -> {
            m.getMessageProperties().setCorrelationId(correlationId);
            m.getMessageProperties().setReplyTo("responseQueue");  // 응답 큐 설정
            return m;
        });
        System.out.println("Sent message: " + message + " with correlationId: " + correlationId);
    }

    //fastAPI
    public Object sendToFastAPIAndWait(String queueName, String message) {
        // Direct Reply-To를 사용하므로 'replyTo'를 설정하지 않습니다.
        return rabbitTemplate.convertSendAndReceive("", queueName, message);
    }

    //FestAPI 설정
//    public Object sendToFastAPIAndWait(String queueName, String message) {
//        // MessageProperties 설정: correlationId, replyTo
//        return rabbitTemplate.convertSendAndReceive("", queueName, message, m -> {
//            m.getMessageProperties().setReplyTo("responseQueue");
//            // correlationId는 자동으로 설정됨
//            return m;
//        }
//        );
//    }
}
