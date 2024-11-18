package com.ssafy.bbogle.keyword.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "키워드 전체 조회 응답 DTO")
public class KeywordListResponse {

    @Schema(description = "키워드 정보 리스트")
    List<KeywordInfoResponse> keywords;

}
