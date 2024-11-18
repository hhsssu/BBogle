package com.ssafy.bbogle.keyword.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.bbogle.activity.entity.ActivityKeyword;
import com.ssafy.bbogle.activity.entity.QActivityKeyword;
import com.ssafy.bbogle.keyword.dto.response.KeywordInfoResponse;
import com.ssafy.bbogle.keyword.entity.QKeyword;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class KeywordRepositoryCustomImpl implements KeywordRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<KeywordInfoResponse> getKeywordInfoList(List<ActivityKeyword> keywordList) {

        QActivityKeyword activityKeyword = QActivityKeyword.activityKeyword;
        QKeyword keyword = QKeyword.keyword;

        List<Integer> keywordIds = keywordList.stream()
            .map(ActivityKeyword::getId)
            .collect(Collectors.toList());

        return queryFactory
            .select(Projections.constructor(KeywordInfoResponse.class,
                keyword.id.as("id"),
                keyword.type.as("type"),
                keyword.name.as("name")
            ))
            .from(activityKeyword)
            .join(activityKeyword.keyword, keyword)
            .where(activityKeyword.id.in(keywordIds))
            .fetch();
    }
}
