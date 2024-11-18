package com.ssafy.bbogle.keyword.service;

import com.ssafy.bbogle.keyword.dto.response.KeywordInfoResponse;
import com.ssafy.bbogle.keyword.dto.response.KeywordListResponse;
import com.ssafy.bbogle.keyword.entity.Keyword;
import com.ssafy.bbogle.keyword.repository.KeywordRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KeywordServiceImpl implements KeywordService {

    private final KeywordRepository keywordRepository;


    @Override
    public KeywordListResponse getKeywordInfo() {

        List<KeywordInfoResponse> result = new ArrayList<>();

        List<Keyword> keywords = keywordRepository.findAll();
        for (Keyword keyword : keywords) {
            KeywordInfoResponse keywordInfoResponse = KeywordInfoResponse.builder()
                .id(keyword.getId())
                .name(keyword.getName())
                .type(keyword.isType())
                .build();

            result.add(keywordInfoResponse);
        }
        return result.isEmpty() ? null : new KeywordListResponse(result);
    }
}
