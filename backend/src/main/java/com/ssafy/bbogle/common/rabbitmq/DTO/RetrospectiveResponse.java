package com.ssafy.bbogle.common.rabbitmq.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RetrospectiveResponse {
    private String retrospective;

    // Getters and Setters
    public String getRetrospective() {
        return retrospective;
    }

    public void setRetrospective(String retrospective) {
        this.retrospective = retrospective;
    }
}
