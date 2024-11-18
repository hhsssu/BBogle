package com.ssafy.bbogle.activity.repository;

import com.ssafy.bbogle.activity.dto.request.ActivitySearchCondRequest;
import com.ssafy.bbogle.activity.dto.response.ActivityListItemResponse;
import com.ssafy.bbogle.activity.entity.Activity;
import com.ssafy.bbogle.user.entity.User;
import java.util.List;

public interface ActivityRepositoryCustom {

    List<Activity> getActivityList(User user, ActivitySearchCondRequest request);

    List<Activity> findByUserKakaoIdAndProjectId(Long kakaoId, Integer projectId);

}
