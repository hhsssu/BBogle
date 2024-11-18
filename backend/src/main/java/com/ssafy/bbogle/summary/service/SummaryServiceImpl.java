package com.ssafy.bbogle.summary.service;

import com.ssafy.bbogle.common.exception.CustomException;
import com.ssafy.bbogle.common.exception.ErrorCode;
import com.ssafy.bbogle.common.util.LoginUser;
import com.ssafy.bbogle.project.entity.Project;
import com.ssafy.bbogle.project.repository.ProjectRepository;
import com.ssafy.bbogle.summary.dto.request.SummaryRequest;
import com.ssafy.bbogle.summary.dto.response.SummaryResponse;
import com.ssafy.bbogle.summary.entity.Summary;
import com.ssafy.bbogle.summary.repository.SummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SummaryServiceImpl implements SummaryService {

    private final SummaryRepository summaryRepository;
    private final ProjectRepository projectRepository;

    @Override
    @Transactional
    public SummaryResponse getSummary(Integer projectId) {

        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        if(!LoginUser.getKakaoId().equals(project.getUser().getKakaoId())){
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS_EXCEPTION);
        }

        Summary summary = summaryRepository.findByProjectId(projectId)
            .orElse(null);

        if (summary == null) {
            return null;
        }

        return SummaryResponse.builder()
            .summaryId(summary.getId())
            .content(summary.getContent())
            .build();
    }

    @Override
    @Transactional
    public void createSummary(Integer projectId, SummaryRequest request) {

        Project project = projectRepository.findById(projectId)
            .orElseThrow(()->new CustomException(ErrorCode.SUMMARY_NOT_FOUND));

        if(!LoginUser.getKakaoId().equals(project.getUser().getKakaoId())){
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS_EXCEPTION);
        }

        Summary summary = Summary.builder()
            .content(request.getContent())
            .project(project)
            .build();

        summaryRepository.save(summary);
    }

    @Override
    @Transactional
    public void updateSummary(Integer summaryId, SummaryRequest request) {

        Summary summary = summaryRepository.findById(summaryId)
            .orElseThrow(()-> new CustomException(ErrorCode.SUMMARY_NOT_FOUND));

        if(!LoginUser.getKakaoId().equals(summary.getProject().getUser().getKakaoId())){
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCESS_EXCEPTION);
        }

        summary.updateContent(request.getContent());
    }
}
