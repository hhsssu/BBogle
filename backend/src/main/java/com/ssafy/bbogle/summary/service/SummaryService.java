package com.ssafy.bbogle.summary.service;

import com.ssafy.bbogle.summary.dto.request.SummaryRequest;
import com.ssafy.bbogle.summary.dto.response.SummaryResponse;

public interface SummaryService {

    SummaryResponse getSummary(Integer projectId);

    void createSummary(Integer projectId, SummaryRequest request);

    void updateSummary(Integer summaryId, SummaryRequest request);
}
