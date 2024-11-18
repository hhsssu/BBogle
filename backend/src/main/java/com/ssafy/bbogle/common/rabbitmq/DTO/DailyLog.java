package com.ssafy.bbogle.common.rabbitmq.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DailyLog {
    private String date;
    private String summary;
    private List<QnAPair> daily_log;

    // Getters and Setters
}