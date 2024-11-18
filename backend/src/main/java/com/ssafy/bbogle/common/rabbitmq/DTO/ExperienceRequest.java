package com.ssafy.bbogle.common.rabbitmq.DTO;

import com.ssafy.bbogle.keyword.entity.Keyword;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ExperienceRequest {
    private String retrospective_content; //파이썬과 맞추기..
    private List<KeywordDTO> keywords;
}
