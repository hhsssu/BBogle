package com.ssafy.bbogle.activity.service;

import com.ssafy.bbogle.activity.dto.request.ActivitySearchCondRequest;
import com.ssafy.bbogle.activity.dto.request.ActivityUpdateRequest;
import com.ssafy.bbogle.activity.dto.request.ActivityUserCreateRequest;
import com.ssafy.bbogle.activity.dto.response.ActivityDetailResponse;
import com.ssafy.bbogle.activity.dto.response.ActivityListItemResponse;
import com.ssafy.bbogle.activity.dto.response.ActivityListResponse;
import com.ssafy.bbogle.activity.entity.Activity;
import com.ssafy.bbogle.activity.entity.ActivityKeyword;
import com.ssafy.bbogle.activity.repository.ActivityKeywordRepository;
import com.ssafy.bbogle.activity.repository.ActivityRepository;
import com.ssafy.bbogle.common.exception.CustomException;
import com.ssafy.bbogle.common.exception.ErrorCode;
import com.ssafy.bbogle.common.util.LoginUser;
import com.ssafy.bbogle.keyword.dto.response.KeywordInfoResponse;
import com.ssafy.bbogle.keyword.entity.Keyword;
import com.ssafy.bbogle.keyword.repository.KeywordRepository;
import com.ssafy.bbogle.project.entity.Project;
import com.ssafy.bbogle.project.repository.ProjectRepository;
import com.ssafy.bbogle.user.entity.User;
import com.ssafy.bbogle.user.repository.UserRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ActivityRepository activityRepository;
    private final KeywordRepository keywordRepository;
    private final ActivityKeywordRepository activityKeywordRepository;

    @Override
    @Transactional
    public void createActivity(ActivityUserCreateRequest request) {
        Long kakaoId = LoginUser.getKakaoId();
        User user = userRepository.findByKakaoId(kakaoId)
            .orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));

        Project project = null;

        if(request.getProjectId() != null){
            project = projectRepository.findById(request.getProjectId())
                .orElseThrow(()->new CustomException(ErrorCode.PROJECT_NOT_FOUND));
        }

        Activity activity = Activity.builder()
            .title(request.getTitle())
            .content(request.getContent())
            .createDate(LocalDate.now())
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .project(project)
            .user(user)
            .build();

        Activity savedActivity = activityRepository.save(activity);

        for(int keywordId : request.getKeywords()){
            Keyword keyword = keywordRepository.findById(keywordId)
                .orElseThrow(()->new CustomException(ErrorCode.KEYWORD_NOT_FOUND));

            ActivityKeyword activityKeyword = ActivityKeyword.addActivityKeyword(savedActivity, keyword);
            activityKeywordRepository.save(activityKeyword);
        }
    }

    @Override
    @Transactional
    public ActivityListResponse searchActivity(ActivitySearchCondRequest request) {

        Long kakaoId = LoginUser.getKakaoId();
        User user = userRepository.findByKakaoId(kakaoId)
            .orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));

        // 검색조건에 맞는 나의 경험 전체 조회
        List<Activity> activities = activityRepository.getActivityList(user, request);

        List<ActivityListItemResponse> activityList = new ArrayList<>();
        for (Activity activity : activities) {
            List<ActivityKeyword> activityKeywords = activity.getActivityKeywords();
            List<KeywordInfoResponse> keywordInfo = keywordRepository.getKeywordInfoList(activityKeywords);

            ActivityListItemResponse activityListItemResponse = ActivityListItemResponse.builder()
                .activityId(activity.getId())
                .title(activity.getTitle())
                .startDate(activity.getStartDate())
                .endDate(activity.getEndDate())
                .keywords(keywordInfo)
                .projectTitle(Optional.ofNullable(activity.getProject())
                    .map(Project::getTitle)
                    .orElse(null))
                .build();

            activityList.add(activityListItemResponse);
        }
        return ActivityListResponse.builder()
            .activities(activityList)
            .build();
    }

    @Override
    @Transactional
    public ActivityDetailResponse getActivityDetail(Integer activityId) {

        Long kakaoId = LoginUser.getKakaoId();

        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(()-> new CustomException(ErrorCode.ACTIVITY_NOT_FOUND));

        if (!activity.getUser().getKakaoId().equals(kakaoId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS_EXCEPTION);
        }

        List<KeywordInfoResponse> keywordInfo = keywordRepository.getKeywordInfoList(activity.getActivityKeywords());

        return ActivityDetailResponse.builder()
            .activityId(activity.getId())
            .title(activity.getTitle())
            .startDate(activity.getStartDate())
            .endDate(activity.getEndDate())
            .keywords(keywordInfo)
            .content(activity.getContent())
            .projectId(Optional.ofNullable(activity.getProject())
                .map(Project::getId)
                .orElse(null))
            .projectTitle(Optional.ofNullable(activity.getProject())
                .map(Project::getTitle)
                .orElse(null))
            .build();
    }


    @Override
    @Transactional
    public void updateActivity(Integer activityId, ActivityUpdateRequest request) {

        Long kakaoId = LoginUser.getKakaoId();

        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(()-> new CustomException(ErrorCode.ACTIVITY_NOT_FOUND));

        if (!activity.getUser().getKakaoId().equals(kakaoId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS_EXCEPTION);
        }

        // 새로 수정된 키워드
        List<Keyword> newKeywords = (request.getKeywords() != null)
            ? keywordRepository.findAllById(request.getKeywords())
            : Collections.emptyList();

        // 기존 등록되어 있던 키워드
        List<Keyword> oldKewords = activity.getActivityKeywords().stream()
            .map(ActivityKeyword::getKeyword)
            .toList();

        // 추가할 키워드
        List<Keyword> keywordsToAdd = newKeywords.stream()
            .filter(keyword -> !oldKewords.contains(keyword))
            .toList();

        // 삭제할 키워드
        List<ActivityKeyword> keywordsToRemove = activity.getActivityKeywords().stream()
            .filter(activityKeyword -> !newKeywords.contains(activityKeyword.getKeyword()))
            .toList();

        // 수정
        keywordsToRemove.forEach(activity::removeKeyword);

        for (Keyword keyword : keywordsToAdd) {
            ActivityKeyword activityKeyword = ActivityKeyword.addActivityKeyword(activity, keyword);
            activityKeywordRepository.save(activityKeyword);
        }

        Project project = null;
        if (request.getProjectId() != null){
            project = projectRepository.findById(request.getProjectId())
                .orElseThrow(()->new CustomException(ErrorCode.PROJECT_NOT_FOUND));
        }

        activity.updateActivity(request, project);
    }


    @Override
    @Transactional
    public void deleteActivity(Integer activityId) {

        Long kakaoId = LoginUser.getKakaoId();

        Activity activity = activityRepository.findById(activityId)
            .orElseThrow(()-> new CustomException(ErrorCode.ACTIVITY_NOT_FOUND));

        if (!activity.getUser().getKakaoId().equals(kakaoId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS_EXCEPTION);
        }

        activityRepository.delete(activity);
    }
}
