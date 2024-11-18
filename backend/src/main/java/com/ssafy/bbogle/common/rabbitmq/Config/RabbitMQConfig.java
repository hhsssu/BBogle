package com.ssafy.bbogle.common.rabbitmq.Config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class RabbitMQConfig {

    @Value("${spring.rabbitmq.host}")
    private String rabbitHost;

    @Value("${spring.rabbitmq.port}")
    private int rabbitPort;

    @Value("${spring.rabbitmq.username}")
    private String rabbitUsername;

    @Value("${spring.rabbitmq.password}")
    private String rabbitPassword;

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        // 타임아웃 설정 (필요에 따라 조절)
        rabbitTemplate.setReplyTimeout(300000);
        return rabbitTemplate;
    }

    @Bean
    public CachingConnectionFactory connectionFactory() {
        CachingConnectionFactory factory = new CachingConnectionFactory(rabbitHost, rabbitPort);
        factory.setUsername(rabbitUsername);
        factory.setPassword(rabbitPassword);
        return factory;
    }

    @Bean
    public Queue titleQueue() {
        return new Queue("titleQueue", true);  // 제목 요약 큐
    }

    @Bean
    public Queue retrospectiveQueue() {
        return new Queue("retrospectiveQueue", true);  // 회고 큐
    }

    @Bean
    public Queue experienceQueue() {
        return new Queue("experienceQueue", true);  // 경험 추출 큐
    }

    @Bean
    public Queue responseQueue() {
        return new Queue("responseQueue", true);  // 응답 큐
    }
}
