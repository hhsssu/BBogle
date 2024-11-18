package com.ssafy.bbogle.common.rabbitmq.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ExperienceResponse {
    private List<ExtractedExperience> experiences;
}
