package com.ssafy.bbogle.common.rabbitmq.DTO;

import com.ssafy.bbogle.keyword.entity.Keyword;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ExtractedExperience {
    private String title;
    private String content;
    private List<KeywordDTO> keywords;
}
