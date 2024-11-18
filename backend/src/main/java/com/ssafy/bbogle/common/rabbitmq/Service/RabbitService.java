//package com.ssafy.bbogle.common.rabbitmq;
//
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class RabbitService {
//
//    private final RabbitSender rabbitSender;
//
//    public RabbitService(RabbitSender rabbitSender) {
//        this.rabbitSender = rabbitSender;
//    }
//
//    public void sendSummaryMessage(List<QuestionAnswer> qnaList) {
//        // 메시지를 JSON 형식으로 변환하여 전송
//        String message = """
//        {
//            "type": "summary",
//            "data": %s
//        }
//        """.formatted(qnaListToJson(qnaList));
//        rabbitSender.sendToFastAPI("summaryQueue", message);
//    }
//
//    public void sendRetrospectiveMessage(List<DailyLog> dailyLogs) {
//        // 메시지를 JSON 형식으로 변환하여 전송
//        String message = """
//        {
//            "type": "retrospective",
//            "data": %s
//        }
//        """.formatted(dailyLogsToJson(dailyLogs));
//        rabbitSender.sendToFastAPI("retrospectiveQueue", message);
//    }
//
//    public void sendExperienceMessage(String retrospectiveContent, String keywords) {
//        // 메시지를 JSON 형식으로 변환하여 전송
//        String message = """
//        {
//            "type": "experience",
//            "data": {
//                "retrospective_content": "%s",
//                "keywords": "%s"
//            }
//        }
//        """.formatted(retrospectiveContent, keywords);
//        rabbitSender.sendToFastAPI("experienceQueue", message);
//    }
//
//    private String qnaListToJson(List<QuestionAnswer> qnaList) {
//        // List<QuestionAnswer>를 JSON 형식으로 변환하는 로직을 구현합니다.
//        // ...
//        return "";
//    }
//
//    private String dailyLogsToJson(List<DailyLog> dailyLogs) {
//        // List<DailyLog>를 JSON 형식으로 변환하는 로직을 구현합니다.
//        // ...
//        return "";
//    }
//}
package com.ssafy.bbogle.common.rabbitmq.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.bbogle.common.rabbitmq.DTO.*;
import com.ssafy.bbogle.common.rabbitmq.Config.RabbitSender;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class RabbitService {

    private final RabbitSender rabbitSender;
    private final ObjectMapper objectMapper;

    public RabbitService(RabbitSender rabbitSender) {
        this.rabbitSender = rabbitSender;
        this.objectMapper = new ObjectMapper();
    }

    // 동기식으로 변경
    public String sendTitleMessage(List<QnAPair> qnaList) {
        try {
            String dataJson = objectMapper.writeValueAsString(qnaList);
            // 메시지를 JSON 형식으로 변환하여 전송
            String message = """
            {
                "type": "title",
                "data": %s
            }
            """.formatted(dataJson);
            Object response = rabbitSender.sendToFastAPIAndWait("titleQueue", message);
//            return response != null ? response.toString() : null;
            return convertResponseToString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    public RetrospectiveResponse sendRetrospectiveMessage(List<DailyLog> dailyLogs) {
        try {
            String dataJson = objectMapper.writeValueAsString(dailyLogs);
            // 메시지를 JSON 형식으로 변환하여 전송
            String message = """
        {
            "type": "retrospective",
            "data": %s
        }
        """.formatted(dataJson);
            Object response = rabbitSender.sendToFastAPIAndWait("retrospectiveQueue", message);

            String responseStr = convertResponseToString(response);
            if (responseStr == null) {
                return null;
            }

            // JSON을 RetrospectiveResponse 객체로 역직렬화
            RetrospectiveResponse retrospectiveResponse = objectMapper.readValue(responseStr, RetrospectiveResponse.class);
            return retrospectiveResponse;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }


//    public String sendRetrospectiveMessage(List<DailyLog> dailyLogs) {
//        try {
//            String dataJson = objectMapper.writeValueAsString(dailyLogs);
//            // 메시지를 JSON 형식으로 변환하여 전송
//            String message = """
//            {
//                "type": "retrospective",
//                "data": %s
//            }
//            """.formatted(dataJson);
//            Object response = rabbitSender.sendToFastAPIAndWait("retrospectiveQueue", message);
////            return response != null ? response.toString() : null;
//            return convertResponseToString(response);
//        } catch (JsonProcessingException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }

//    public String sendExperienceMessage(ExperienceRequest experienceRequest) {
//        try {
//            String dataJson = objectMapper.writeValueAsString(experienceRequest);
//            // 메시지를 JSON 형식으로 변환하여 전송
//            String message = """
//            {
//                "type": "experience",
//                "data": %s
//            }
//            """.formatted(dataJson);
//            Object response = rabbitSender.sendToFastAPIAndWait("experienceQueue", message);
////            return response != null ? response.toString() : null;
//            return convertResponseToString(response);
//        } catch (JsonProcessingException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }

    public ExperienceResponse sendExperienceMessage(ExperienceRequest experienceRequest) {
        try {
            // Python에서 사용하는 request 형식에 맞게 JSON 생성
            String dataJson = objectMapper.writeValueAsString(experienceRequest);

            // 메시지를 JSON 형식으로 변환하여 전송
            String message = """
            {
                "type": "experience",
                "data": %s
            }
            """.formatted(dataJson);

            // 동기식 호출 사용
            Object response = rabbitSender.sendToFastAPIAndWait("experienceQueue", message);

            // JSON 응답을 ExperienceResponse 객체로 변환
            String responseStr = convertResponseToString(response);
            if (responseStr == null) {
                return null;
            }

            // JSON을 ExperienceResponse 객체로 역직렬화
            ExperienceResponse experienceResponse = objectMapper.readValue(responseStr, ExperienceResponse.class);
            return experienceResponse;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }


    private String convertResponseToString(Object response) {
        if (response == null) {
            return null;
        }
        if (response instanceof byte[]) {
            // 바이트 배열을 UTF-8 인코딩의 문자열로 변환
            return new String((byte[]) response, StandardCharsets.UTF_8);
        } else {
            // 바이트 배열 이외의 경우 (예: 이미 문자열인 경우)
            return response.toString();
        }
    }

//    // 제목
//    public void sendSummaryMessage(List<QuestionAnswer> qnaList) {
//        try {
//            String dataJson = objectMapper.writeValueAsString(qnaList);
//            // 메시지를 JSON 형식으로 변환하여 전송
//            String message = """
//            {
//                "type": "summary",
//                "data": %s
//            }
//            """.formatted(dataJson);
//            rabbitSender.sendToFastAPI("summaryQueue", message);
//        } catch (JsonProcessingException e) {
//            e.printStackTrace();
//        }
//    }
//    // 회고
//    public void sendRetrospectiveMessage(List<DailyLog> dailyLogs) {
//        try {
//            String dataJson = objectMapper.writeValueAsString(dailyLogs);
//            // 메시지를 JSON 형식으로 변환하여 전송
//            String message = """
//            {
//                "type": "retrospective",
//                "data": %s
//            }
//            """.formatted(dataJson);
//            rabbitSender.sendToFastAPI("retrospectiveQueue", message);
//        } catch (JsonProcessingException e) {
//            e.printStackTrace();
//        }
//    }
//    // 경험 추출
//    public void sendExperienceMessage(ExperienceRequest experienceRequest) {
//        try {
//            String dataJson = objectMapper.writeValueAsString(experienceRequest);
//            // 메시지를 JSON 형식으로 변환하여 전송
//            String message = """
//            {
//                "type": "experience",
//                "data": %s
//            }
//            """.formatted(dataJson);
//            rabbitSender.sendToFastAPI("experienceQueue", message);
//        } catch (JsonProcessingException e) {
//            e.printStackTrace();
//        }
//    }
}
