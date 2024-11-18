package com.ssafy.bbogle.fcm.service;

import com.ssafy.bbogle.fcm.dto.request.FcmSaveRequest;

public interface FcmService {

    void saveFcm(FcmSaveRequest request);
}
