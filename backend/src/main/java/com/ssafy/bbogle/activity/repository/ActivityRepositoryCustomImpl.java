package com.ssafy.bbogle.activity.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.bbogle.activity.dto.request.ActivitySearchCondRequest;
import com.ssafy.bbogle.activity.dto.response.ActivityListItemResponse;
import com.ssafy.bbogle.activity.dto.response.ActivityListResponse;
import com.ssafy.bbogle.activity.entity.Activity;
import com.ssafy.bbogle.activity.entity.QActivity;
import com.ssafy.bbogle.activity.entity.QActivityKeyword;
import com.ssafy.bbogle.keyword.dto.response.KeywordInfoResponse;
import com.ssafy.bbogle.keyword.entity.Keyword;
import com.ssafy.bbogle.keyword.entity.QKeyword;
//import com.ssafy.bbogle.project.entity.QProject;
//import com.ssafy.bbogle.user.entity.User;
import com.ssafy.bbogle.project.entity.QProject;
import com.ssafy.bbogle.user.entity.QUser;
import com.ssafy.bbogle.user.entity.User;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ActivityRepositoryCustomImpl implements ActivityRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Activity> getActivityList(User user, ActivitySearchCondRequest request) {

        QActivity activity = QActivity.activity;
        QActivityKeyword activityKeyword = QActivityKeyword.activityKeyword;
        QKeyword keyword = QKeyword.keyword;
        QProject project = QProject.project;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(activity.user.eq(user));

        String word = request.getWord();
        List<Integer> keywords = request.getKeywords();
        List<Integer> projects = request.getProjects();

        if (word != null) {
            builder.and(activity.title.containsIgnoreCase(word));
        }

        if (keywords != null && !keywords.isEmpty()) {
            builder.and(activityKeyword.keyword.id.in(keywords));
        }

        if (projects != null && !projects.isEmpty()) {
            builder.and(activity.project.id.in(projects));
        }

        List<Activity> activities = queryFactory
            .select(activity)
            .from(activity)
            .leftJoin(activity.project, project).fetchJoin()
            .leftJoin(activity.activityKeywords, activityKeyword).fetchJoin()
            .where(builder)
            .distinct()
            .fetch();

        return activities;


    }

    @Override
    public List<Activity> findByUserKakaoIdAndProjectId(Long kakaoId, Integer projectId) {

        QActivity activity = QActivity.activity;
        QProject project = QProject.project;
        QUser user = QUser.user;

        return queryFactory
            .selectFrom(activity)
            .join(activity.user, user)
            .join(activity.project, project).fetchJoin()
            .where(user.kakaoId.eq(kakaoId)
                .and(project.id.eq(projectId)))
            .fetch();
    }


}
