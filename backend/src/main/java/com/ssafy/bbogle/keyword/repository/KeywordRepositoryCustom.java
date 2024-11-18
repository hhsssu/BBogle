package com.ssafy.bbogle.keyword.repository;

import com.ssafy.bbogle.activity.entity.ActivityKeyword;
import com.ssafy.bbogle.keyword.dto.response.KeywordInfoResponse;
import java.util.List;

public interface KeywordRepositoryCustom {

    List<KeywordInfoResponse> getKeywordInfoList(List<ActivityKeyword> keywordList);

}
