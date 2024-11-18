package com.ssafy.bbogle.activity.service;

import com.ssafy.bbogle.activity.dto.request.ActivitySearchCondRequest;
import com.ssafy.bbogle.activity.dto.request.ActivityUpdateRequest;
import com.ssafy.bbogle.activity.dto.request.ActivityUserCreateRequest;
import com.ssafy.bbogle.activity.dto.response.ActivityDetailResponse;
import com.ssafy.bbogle.activity.dto.response.ActivityListResponse;

public interface ActivityService {

    void createActivity(ActivityUserCreateRequest request);

    ActivityListResponse searchActivity(ActivitySearchCondRequest request);

    ActivityDetailResponse getActivityDetail(Integer activityId);

    void deleteActivity(Integer activityId);

    void updateActivity(Integer activityId, ActivityUpdateRequest request);
}
