package com.ssafy.bbogle.diary.service;

import com.ssafy.bbogle.common.exception.CustomException;
import com.ssafy.bbogle.common.exception.ErrorCode;
import com.ssafy.bbogle.common.util.LoginUser;
import com.ssafy.bbogle.common.util.S3Util;
import com.ssafy.bbogle.diary.dto.request.DiaryCreateRequest;
import com.ssafy.bbogle.diary.dto.request.DiaryUpdateRequest;
import com.ssafy.bbogle.diary.dto.response.*;
import com.ssafy.bbogle.diary.entity.Answer;
import com.ssafy.bbogle.diary.entity.Diary;
import com.ssafy.bbogle.diary.entity.DiaryImage;
import com.ssafy.bbogle.diary.entity.Question;
import com.ssafy.bbogle.diary.repository.DiaryRepository;
import com.ssafy.bbogle.diary.repository.QuestionRepository;
import com.ssafy.bbogle.project.entity.Project;
import com.ssafy.bbogle.project.repository.ProjectRepository;
import com.ssafy.bbogle.user.entity.User;
import com.ssafy.bbogle.user.repository.UserRepository;

import java.io.IOException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DiaryService {
    private final DiaryRepository diaryRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final S3Util s3Util;

    public TodayDiaryListResponse getTodayDiary() {
        Long kakaoId = LoginUser.getKakaoId();
        log.info("오늘의 개발일지 조회 요청. kakaoId: {}", kakaoId);

        List<Diary> todayDiaries = diaryRepository
                .findByUser_KakaoIdAndCreateDateOrderById(kakaoId, LocalDate.now());  // ID 기준 정렬

        List<TodayDiaryListItemResponse> diaries = todayDiaries.stream()
                .map(diary -> TodayDiaryListItemResponse.builder()
                        .projectId(diary.getProject().getId())
                        .diaryId(diary.getId())
                        .title(diary.getTitle())
                        .createDate(diary.getCreateDate())
                        .projectTitle(diary.getProject().getTitle())
                        .build())
                .collect(Collectors.toList());

        return TodayDiaryListResponse.builder()
                .diaries(diaries)
                .build();
    }

    public DiaryListResponse getAllDiaries(Integer projectId) {
        Long kakaoId = LoginUser.getKakaoId();
        log.info("프로젝트의 전체 개발일지 조회 요청. kakaoId: {}, projectId: {}", kakaoId, projectId);

        Project project = projectRepository.findByIdAndUser_KakaoId(projectId, kakaoId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        List<Diary> diaries = diaryRepository.findByProject_IdOrderById(projectId);  // ID 기준 정렬

        List<DiaryListItemResponse> diaryList = diaries.stream()
                .map(diary -> DiaryListItemResponse.builder()
                        .diaryId(diary.getId())
                        .title(diary.getTitle())
                        .createDate(diary.getCreateDate())
                        .build())
                .collect(Collectors.toList());

        return DiaryListResponse.builder()
                .diaryList(diaryList)
                .build();
    }

    @Transactional
    public void createDiary(Integer projectId, DiaryCreateRequest request, List<MultipartFile> files) {
        Long kakaoId = LoginUser.getKakaoId();
        log.info("개발일지 작성 요청. kakaoId: {}, projectId: {}", kakaoId, projectId);

        User user = userRepository.findByKakaoId(kakaoId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Project project = projectRepository.findByIdAndUser_KakaoId(projectId, kakaoId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        Diary diary = Diary.builder()
                .user(user)
                .project(project)
                .createDate(LocalDate.now())
                .title(request.getTitle())
                .build();

        List<Question> questions = questionRepository.findAllByOrderById();

        // answers가 null일 수 있으므로 체크 후 초기화
        if (request.getAnswers() != null && !request.getAnswers().isEmpty()) {
            if (questions.size() != request.getAnswers().size()) {
                throw new CustomException(ErrorCode.INVALID_ANSWER_COUNT);
            }

            diary.setAnswers(new HashSet<>()); // null을 허용하되 필요 시 초기화
            for (int i = 0; i < questions.size(); i++) {
                Answer answer = Answer.builder()
                        .diary(diary)
                        .question(questions.get(i))
                        .answer(request.getAnswers().get(i))
                        .build();
                diary.getAnswers().add(answer);
            }
        }


        // files가 비어있지 않다면 파일 저장
        if (files != null && !files.isEmpty()) {
            diary.setDiaryImages(new HashSet<>());
            files.forEach(image -> {
                if (!image.isEmpty()) {  // 각 파일이 비어있지 않은 경우에만 처리
                    String imageUrl = null;
                    try {
                        imageUrl = s3Util.upload(image);
                    } catch (IOException e) {
                        throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
                    }
                    DiaryImage diaryImage = DiaryImage.builder()
                            .diary(diary)
                            .url(imageUrl)
                            .build();
                    diary.getDiaryImages().add(diaryImage);
                }
            });
        }

        diaryRepository.save(diary);
        log.info("개발일지 작성 완료. kakaoId: {}, projectId: {}, diaryId: {}", kakaoId, projectId, diary.getId());
    }


    public DiaryDetailResponse getDiaryDetail(Integer projectId, Integer diaryId) {
        Long kakaoId = LoginUser.getKakaoId();
        log.info("개발일지 상세 조회 요청. kakaoId: {}, projectId: {}, diaryId: {}", kakaoId, projectId, diaryId);

        Diary diary = diaryRepository.findByIdAndProject_IdWithDetails(diaryId, projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.DIARY_NOT_FOUND));

        return DiaryDetailResponse.builder()
                .diaryId(diary.getId())
                .title(diary.getTitle())
                .createDate(diary.getCreateDate())
                .answers(diary.getAnswers().stream()
                        .sorted(Comparator.comparing(answer -> answer.getQuestion().getId()))  // ID 기준 오름차순 정렬
                        .map(answer -> QuestionAnswerResponse.builder()
                                .question(answer.getQuestion().getContent())
                                .description(answer.getQuestion().getDescription())
                                .answer(answer.getAnswer())
                                .build())
                        .collect(Collectors.toList()))  // List로 변환하여 순서 보장
                .images(diary.getDiaryImages().stream()
                        .sorted(Comparator.comparing(DiaryImage::getId))  // ID 기준 오름차순 정렬
                        .map(DiaryImage::getUrl)
                        .collect(Collectors.toList()))  // List로 변환하여 순서 보장
                .build();
    }

    @Transactional
    public void updateDiary(Integer projectId, Integer diaryId, DiaryUpdateRequest request, List<MultipartFile> files) {
        Long kakaoId = LoginUser.getKakaoId();
        log.info("개발일지 수정 요청. kakaoId: {}, projectId: {}, diaryId: {}", kakaoId, projectId, diaryId);

        Project project = projectRepository.findByIdAndUser_KakaoId(projectId, kakaoId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        Diary diary = diaryRepository.findByIdAndProject_Id(diaryId, projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.DIARY_NOT_FOUND));

        diary.setTitle(request.getTitle());

        if (request.getAnswers() != null && !request.getAnswers().isEmpty()) {
            if (diary.getAnswers() == null) {
                diary.setAnswers(new HashSet<>()); // null일 경우 초기화
            }

            List<Answer> answers = diary.getAnswers().stream()
                    .sorted(Comparator.comparing(answer -> answer.getQuestion().getId()))
                    .collect(Collectors.toList());

            if (answers.size() != request.getAnswers().size()) {
                throw new CustomException(ErrorCode.INVALID_ANSWER_COUNT);
            }

            for (int i = 0; i < answers.size(); i++) {
                answers.get(i).setAnswer(request.getAnswers().get(i));
            }
        }

        // 기존 사진들이 있다면 삭제
        if (diary.getDiaryImages() != null) {
            for (DiaryImage oldImage : diary.getDiaryImages()) {
                String oldImageUrl = oldImage.getUrl();
                s3Util.deleteFile(oldImageUrl);
            }
            diary.getDiaryImages().clear();
        }

        // 새로운 파일들이 있는 경우에만 처리
        if (files != null && !files.isEmpty()) {
            if (diary.getDiaryImages() == null) {
                diary.setDiaryImages(new HashSet<>());
            }

            files.forEach(image -> {
                if (!image.isEmpty()) {  // 각 파일이 비어있지 않은 경우에만 처리
                    String imageUrl = null;
                    try {
                        imageUrl = s3Util.upload(image);
                    } catch (IOException e) {
                        throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
                    }
                    DiaryImage diaryImage = DiaryImage.builder()
                            .diary(diary)
                            .url(imageUrl)
                            .build();
                    diary.getDiaryImages().add(diaryImage);
                }
            });
        }

        log.info("개발일지 수정 완료. kakaoId: {}, projectId: {}, diaryId: {}", kakaoId, projectId, diaryId);
    }

    @Transactional
    public void deleteDiary(Integer projectId, Integer diaryId) {
        Long kakaoId = LoginUser.getKakaoId();
        log.info("개발일지 삭제 요청. kakaoId: {}, projectId: {}, diaryId: {}", kakaoId, projectId, diaryId);

        Project project = projectRepository.findByIdAndUser_KakaoId(projectId, kakaoId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        Diary diary = diaryRepository.findByIdAndProject_Id(diaryId, projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.DIARY_NOT_FOUND));

        diaryRepository.delete(diary);
        log.info("개발일지 삭제 완료. kakaoId: {}, projectId: {}, diaryId: {}", kakaoId, projectId, diaryId);
    }

    public List<DiaryDetailResponse> getAllDiariesDetail(Integer projectId) {
        Long kakaoId = LoginUser.getKakaoId();
        log.info("프로젝트의 모든 개발일지 상세 조회 요청. kakaoId: {}, projectId: {}", kakaoId, projectId);

        List<Diary> diaries = diaryRepository.findByProject_IdWithDetails(projectId);

        return diaries.stream()
                .sorted(Comparator.comparing(Diary::getId))  // ID 기준 오름차순 정렬
                .map(diary -> DiaryDetailResponse.builder()
                        .diaryId(diary.getId())
                        .title(diary.getTitle())
                        .createDate(diary.getCreateDate())
                        .answers(diary.getAnswers().stream()
                                .sorted(Comparator.comparing(answer -> answer.getQuestion().getId()))
                                .map(answer -> QuestionAnswerResponse.builder()
                                        .question(answer.getQuestion().getContent())
                                        .description(answer.getQuestion().getDescription())
                                        .answer(answer.getAnswer())
                                        .build())
                                .collect(Collectors.toList()))
                        .images(diary.getDiaryImages().stream()
                                .sorted(Comparator.comparing(DiaryImage::getId))  // 이미지도 ID 기준 정렬 추가
                                .map(DiaryImage::getUrl)
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());
    }

    public List<QuestionResponse> getQuestions() {
        log.info("개발일지 질문 목록 조회 요청");

        return questionRepository.findAllByOrderById().stream()
                .map(question -> QuestionResponse.builder()
                        .id(question.getId())
                        .question(question.getContent())
                        .description(question.getDescription())
                        .build())
                .collect(Collectors.toList());
    }
}