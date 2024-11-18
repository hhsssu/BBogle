package com.ssafy.bbogle.project.service;

import com.ssafy.bbogle.activity.dto.request.ActivityAutoCreateRequest;
import com.ssafy.bbogle.activity.dto.request.ActivitySelectRequest;
import com.ssafy.bbogle.activity.dto.response.ActivityListItemResponse;
import com.ssafy.bbogle.activity.dto.response.ActivityListResponse;
import com.ssafy.bbogle.activity.entity.Activity;
import com.ssafy.bbogle.activity.entity.ActivityKeyword;
import com.ssafy.bbogle.activity.repository.ActivityKeywordRepository;
import com.ssafy.bbogle.activity.repository.ActivityRepository;
import com.ssafy.bbogle.common.exception.CustomException;
import com.ssafy.bbogle.common.exception.ErrorCode;
import com.ssafy.bbogle.common.util.LoginUser;
import com.ssafy.bbogle.common.util.S3Util;
import com.ssafy.bbogle.keyword.dto.response.KeywordInfoResponse;
import com.ssafy.bbogle.keyword.entity.Keyword;
import com.ssafy.bbogle.keyword.repository.KeywordRepository;
import com.ssafy.bbogle.notification.entity.Notification;
import com.ssafy.bbogle.notification.repository.NotificationRepository;
import com.ssafy.bbogle.project.dto.request.NotificationStatusRequest;
import com.ssafy.bbogle.project.dto.request.ProjectCreateRequest;
import com.ssafy.bbogle.project.dto.request.ProjectUpdateRequest;
import com.ssafy.bbogle.project.dto.response.ProjectDetailResponse;
import com.ssafy.bbogle.project.dto.response.ProjectListItemResponse;
import com.ssafy.bbogle.project.dto.response.ProjectListResponse;
import com.ssafy.bbogle.project.dto.response.ProjectTitleItemResponse;
import com.ssafy.bbogle.project.dto.response.ProjectTitleListResponse;
import com.ssafy.bbogle.project.entity.Project;
import com.ssafy.bbogle.project.entity.ProjectTag;
import com.ssafy.bbogle.project.entity.ProjectTagType;
import com.ssafy.bbogle.project.repository.ProjectRepository;
import com.ssafy.bbogle.summary.dto.request.SummaryRequest;
import com.ssafy.bbogle.user.entity.User;
import com.ssafy.bbogle.user.repository.UserRepository;
import java.io.IOException;
import java.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProjectService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectService.class);
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final S3Util s3Util;
    private final ActivityRepository activityRepository;
    private final KeywordRepository keywordRepository;
    private final ActivityKeywordRepository activityKeywordRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository,
                          UserRepository userRepository,
                          NotificationRepository notificationRepository, S3Util s3Util,
        ActivityRepository activityRepository, KeywordRepository keywordRepository,
        ActivityKeywordRepository activityKeywordRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.s3Util = s3Util;
        this.activityRepository = activityRepository;
        this.keywordRepository = keywordRepository;
        this.activityKeywordRepository = activityKeywordRepository;
    }

    @Transactional
    public void createProject(ProjectCreateRequest request, MultipartFile file) {
        Long kakaoId = LoginUser.getKakaoId();
        logger.info("프로젝트 생성 요청을 받았습니다. kakaoId: {}", kakaoId);

        User user = userRepository.findByKakaoId(kakaoId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String imageUrl = null;

        if (file != null && !file.isEmpty()) {
            try {
                imageUrl = s3Util.upload(file);
            } catch (IOException e) {
                throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
            }
        }

        Project project = Project.builder()
                .user(user)
                .title(request.getTitle())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .memberCount(request.getMemberCount())
                .status(true)
                .image(imageUrl)
                .tags(new ArrayList<>())  // 빈 리스트로 초기화하여 null 방지
                .build();

        projectRepository.save(project);

        saveProjectTags(project, request.getRole(), ProjectTagType.ROLE);
        saveProjectTags(project, request.getSkill(), ProjectTagType.SKILL);

        Notification notification = Notification.builder()
                .project(project)
                .time(request.getNotificationTime())
                .status(request.isNotificationStatus())
                .build();

        notificationRepository.save(notification);

        logger.info("프로젝트가 성공적으로 생성되었습니다. kakaoId: {}", kakaoId);
    }

    public ProjectListResponse getAllProjects() {
        Long kakaoId = LoginUser.getKakaoId();
        logger.info("전체 프로젝트 조회 요청을 받았습니다. kakaoId: {}", kakaoId);

        List<ProjectListItemResponse> projectList = projectRepository.findByUser_KakaoId(kakaoId).stream()
                .map(project -> {
                    Notification notification = notificationRepository.findByProject_Id(project.getId())
                            .orElseThrow(() -> new CustomException(ErrorCode.NOTIFICATION_NOT_FOUND));

                    return ProjectListItemResponse.builder()
                            .projectId(project.getId())
                            .title(project.getTitle())
                            .description(project.getDescription())
                            .image(project.getImage())
                            .status(project.isStatus())
                            .startDate(project.getStartDate())
                            .endDate(project.getEndDate())
                            .notificationStatus(notification.isStatus())
                            .build();
                })
                .collect(Collectors.toList());
        logger.info("전체 프로젝트 조회가 완료되었습니다. kakaoId: {}", kakaoId);
        return ProjectListResponse.builder().projectList(projectList).build();
    }

    public ProjectListResponse getInProgressProjects() {
        Long kakaoId = LoginUser.getKakaoId();
        logger.info("진행 중인 프로젝트 조회 요청을 받았습니다. kakaoId: {}", kakaoId);

        List<ProjectListItemResponse> projectList = projectRepository.findByUser_KakaoIdAndStatus(kakaoId, true).stream()
                .map(project -> {
                    Notification notification = notificationRepository.findByProject_Id(project.getId())
                            .orElseThrow(() -> new CustomException(ErrorCode.NOTIFICATION_NOT_FOUND));

                    return ProjectListItemResponse.builder()
                            .projectId(project.getId())
                            .title(project.getTitle())
                            .description(project.getDescription())
                            .image(project.getImage())
                            .status(project.isStatus())
                            .startDate(project.getStartDate())
                            .endDate(project.getEndDate())
                            .notificationStatus(notification.isStatus())
                            .build();
                })
                .collect(Collectors.toList());
        logger.info("진행 중인 프로젝트 조회가 완료되었습니다. kakaoId: {}", kakaoId);
        return ProjectListResponse.builder().projectList(projectList).build();
    }

    @Transactional
    public ProjectDetailResponse getProjectById(Integer projectId) {
        Long kakaoId = LoginUser.getKakaoId();
        logger.info("프로젝트 상세 조회 요청을 받았습니다. kakaoId: {}, projectId: {}", kakaoId, projectId);

        Project project = projectRepository.findByIdAndUser_KakaoId(projectId, kakaoId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        Notification notification = notificationRepository.findByProject_Id(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTIFICATION_NOT_FOUND));

        ProjectDetailResponse response = ProjectDetailResponse.builder()
                .projectId(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .image(project.getImage())
                .status(project.isStatus())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .memberCount(project.getMemberCount())
                .role(project.getTags().stream()
                        .filter(tag -> tag.getType() == ProjectTagType.ROLE)
                        .map(ProjectTag::getName)
                        .collect(Collectors.toList()))
                .skill(project.getTags().stream()
                        .filter(tag -> tag.getType() == ProjectTagType.SKILL)
                        .map(ProjectTag::getName)
                        .collect(Collectors.toList()))
                .notificationStatus(notification.isStatus())
                .notificationTime(notification.getTime().format(java.time.format.DateTimeFormatter.ofPattern("HH:mm")))
                .build();

        logger.info("프로젝트 상세 조회가 완료되었습니다. kakaoId: {}, projectId: {}", kakaoId, projectId);
        return response;
    }


    @Transactional
    public void updateProject(Integer projectId, ProjectUpdateRequest request, MultipartFile file) {
        Long kakaoId = LoginUser.getKakaoId();
        logger.info("프로젝트 수정 요청을 받았습니다. kakaoId: {}, projectId: {}", kakaoId, projectId);

        Project existingProject = projectRepository.findByIdAndUser_KakaoId(projectId, kakaoId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        // 기존 사진은 지우기
        String oldImageUrl = existingProject.getImage();
        if(oldImageUrl != null) {
            s3Util.deleteFile(oldImageUrl);
        }

        // 새 사진 등록
        if(file != null && !file.isEmpty()) {
            try {
                existingProject.setImage(s3Util.upload(file));
            } catch (IOException e) {
                throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
            }
        }

        existingProject.setTitle(request.getTitle());
        existingProject.setDescription(request.getDescription());
        existingProject.setStartDate(request.getStartDate());
        existingProject.setEndDate(request.getEndDate());
        existingProject.setMemberCount(request.getMemberCount());

        existingProject.getTags().clear();
        saveProjectTags(existingProject, request.getRole(), ProjectTagType.ROLE);
        saveProjectTags(existingProject, request.getSkill(), ProjectTagType.SKILL);

        projectRepository.save(existingProject);

        Notification existingNotification = notificationRepository.findByProject_Id(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTIFICATION_NOT_FOUND));

        existingNotification.setTime(request.getNotificationTime());
        existingNotification.setStatus(request.isNotificationStatus());

        notificationRepository.save(existingNotification);

        logger.info("프로젝트가 성공적으로 수정되었습니다. kakaoId: {}, projectId: {}", kakaoId, projectId);
    }

    @Transactional
    public void deleteProject(Integer projectId) {
        Long kakaoId = LoginUser.getKakaoId();
        logger.info("프로젝트 삭제 요청을 받았습니다. kakaoId: {}, projectId: {}", kakaoId, projectId);

        Project project = projectRepository.findByIdAndUser_KakaoId(projectId, kakaoId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        projectRepository.delete(project);
        logger.info("프로젝트가 성공적으로 삭제되었습니다. kakaoId: {}, projectId: {}", kakaoId, projectId);
    }

    @Transactional
    public void endProject(Integer projectId) {
        Long kakaoId = LoginUser.getKakaoId();
        logger.info("프로젝트 종료 요청을 받았습니다. kakaoId: {}, projectId: {}", kakaoId, projectId);

        // 프로젝트 상태 변경
        Project existingProject = projectRepository.findByIdAndUser_KakaoId(projectId, kakaoId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));
        existingProject.setStatus(false);

        // 알림 상태도 false로 변경
        Notification notification = notificationRepository.findByProject_Id(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTIFICATION_NOT_FOUND));
        notification.setStatus(false);

        logger.info("프로젝트가 성공적으로 종료되었습니다. kakaoId: {}, projectId: {}", kakaoId, projectId);
    }

    @Transactional
    public void toggleNotificationStatus(Integer projectId, NotificationStatusRequest request) {
        Long kakaoId = LoginUser.getKakaoId();
        logger.info("프로젝트 알림 상태 변경 요청을 받았습니다. kakaoId: {}, projectId: {}", kakaoId, projectId);

        projectRepository.findByIdAndUser_KakaoId(projectId, kakaoId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        Notification existingNotification = notificationRepository.findByProject_Id(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTIFICATION_NOT_FOUND));

        existingNotification.setStatus(request.isStatus());
        notificationRepository.save(existingNotification);

        logger.info("알림 상태가 성공적으로 변경되었습니다. kakaoId: {}, projectId: {}", kakaoId, projectId);
    }

    // 역할과 스킬 태그를 저장하는 헬퍼 메서드
    private void saveProjectTags(Project project, List<String> tags, ProjectTagType type) {
        if (project.getTags() == null) {
            project.setTags(new ArrayList<>());
        }

        List<ProjectTag> projectTags = tags.stream()
                .map(tag -> ProjectTag.builder()
                        .project(project)
                        .type(type)
                        .name(tag)
                        .build())
                .collect(Collectors.toList());

        project.getTags().addAll(projectTags);
    }

    @Transactional
    public ProjectTitleListResponse getAllProjectTitle() {

        Long kakaoId = LoginUser.getKakaoId();

        List<ProjectTitleItemResponse> projectTitleList = new ArrayList<>();

        List<Project> projects = projectRepository.findByUser_KakaoId(kakaoId);

        // 프로젝트가 조회 된다면
        if (!projects.isEmpty()) {
            for (Project project : projects) {
                ProjectTitleItemResponse item = ProjectTitleItemResponse.builder()
                    .projectId(project.getId())
                    .title(project.getTitle())
                    .build();
                projectTitleList.add(item);
            }
        }

        return ProjectTitleListResponse.builder()
            .projects(projectTitleList)
            .build();
    }

    @Transactional
    public ActivityListResponse getActivitiesByProject(Integer projectId) {
        Long kakaoId = LoginUser.getKakaoId();

        List<Activity> activities = activityRepository.findByUserKakaoIdAndProjectId(kakaoId, projectId);

        List<ActivityListItemResponse> activitiesList = new ArrayList<>();
        for (Activity activity : activities) {
            List<ActivityKeyword> activityKeywords = activity.getActivityKeywords();
            List<KeywordInfoResponse> keywordInfo = keywordRepository.getKeywordInfoList(activityKeywords);

            ActivityListItemResponse activityListItemResponse = ActivityListItemResponse.builder()
                .activityId(activity.getId())
                .title(activity.getTitle())
                .startDate(activity.getStartDate())
                .endDate(activity.getEndDate())
                .keywords(keywordInfo)
                .projectTitle(activity.getProject().getTitle())
                .build();
            activitiesList.add(activityListItemResponse);
        }

        return ActivityListResponse.builder()
            .activities(activitiesList)
            .build();
    }

    @Transactional
    public void selectActivity(Integer projectId, ActivitySelectRequest request) {

        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        Long kakaoId = LoginUser.getKakaoId();
        User user = userRepository.findByKakaoId(kakaoId)
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 기존 프로젝트 관련 경험들 중에 선택되지 않은 경험은 삭제
        List<Activity> existingActivities = activityRepository.findByUserKakaoIdAndProjectId(kakaoId, projectId);
        List<Integer> savedExistingActivities = request.getSavedActivities();

        existingActivities.stream()
            .filter(activity -> !savedExistingActivities.contains(activity.getId()))
            .forEach(activityRepository::delete);

        // 새로 들어온 request를 저장
        List<ActivityAutoCreateRequest> newActivities = request.getNewActivities();

        for (ActivityAutoCreateRequest newActivity : newActivities) {
            Activity activity = Activity.builder()
                .title(newActivity.getTitle())
                .content(newActivity.getContent())
                .createDate(LocalDate.now())
                .startDate(newActivity.getStartDate())
                .endDate(newActivity.getEndDate())
                .user(user)
                .project(project)
                .build();

            Activity savedActivity = activityRepository.save(activity);

            Keyword keyword = keywordRepository.findById(newActivity.getKeywords())
                .orElseThrow(() -> new CustomException(ErrorCode.KEYWORD_NOT_FOUND));
            ActivityKeyword activityKeyword = ActivityKeyword.addActivityKeyword(savedActivity, keyword);
            activityKeywordRepository.save(activityKeyword);
        }

    }
}
