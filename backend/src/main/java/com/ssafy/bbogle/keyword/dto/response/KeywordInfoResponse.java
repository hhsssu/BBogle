package com.ssafy.bbogle.keyword.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@Schema(description = "키워드 정보 응답 DTO")
public class KeywordInfoResponse {

    @Schema(description = "키워드 ID")
    private Integer id;

    @Schema(description = "종류 0:기술, 1:인성")
    private Boolean type;

    @Schema(description = "이름")
    private String name;
}
