//package com.ssafy.bbogle.common.rabbitmq;
//
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/rabbitmq")
//public class RabbitController {
//
//    private final RabbitService rabbitService;
//
//    public RabbitController(RabbitService rabbitService) {
//        this.rabbitService = rabbitService;
//    }
//
//    @PostMapping("/send/summary")
//    public String sendSummary(@RequestBody List<QuestionAnswer> qnaList) {
//        rabbitService.sendSummaryMessage(qnaList);
//        return "Summary message sent: " + qnaList;
//    }
//
//    @PostMapping("/send/retrospective")
//    public String sendRetrospective(@RequestBody List<DailyLog> dailyLogs) {
//        rabbitService.sendRetrospectiveMessage(dailyLogs);
//        return "Retrospective message sent: " + dailyLogs;
//    }
//
//    @PostMapping("/send/experience")
//    public String sendExperience(@RequestParam String retrospectiveContent, @RequestParam String keywords) {
//        rabbitService.sendExperienceMessage(retrospectiveContent, keywords);
//        return "Experience message sent: " + retrospectiveContent + ", Keywords: " + keywords;
//    }
//}
package com.ssafy.bbogle.common.rabbitmq.Controller;

import com.ssafy.bbogle.common.rabbitmq.DTO.*;
import com.ssafy.bbogle.common.rabbitmq.Service.RabbitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rabbitmq")
public class RabbitController {

    private final RabbitService rabbitService;

    public RabbitController(RabbitService rabbitService) {
        this.rabbitService = rabbitService;
    }
    //동기식
    @PostMapping(value = "/send/title", produces = "application/json")
    public String sendTitle(@RequestBody List<QnAPair> qnaList) {
        String result = rabbitService.sendTitleMessage(qnaList);
        return result != null ? result : "Error processing title";
    }

    @PostMapping("/send/retrospective")
    public RetrospectiveResponse sendRetrospective(@RequestBody List<DailyLog> dailyLogs) {
        RetrospectiveResponse result = rabbitService.sendRetrospectiveMessage(dailyLogs);
        if (result == null) {
            throw new RuntimeException("Error processing retrospective");
        }
        return result;
    }
//    @PostMapping("/send/retrospective")
//    public String sendRetrospective(@RequestBody List<DailyLog> dailyLogs) {
//        String result = rabbitService.sendRetrospectiveMessage(dailyLogs);
//        return result != null ? result : "Error processing retrospective";
//    }

    @PostMapping("/send/experience")
    public ExperienceResponse sendExperience(@RequestBody ExperienceRequest experienceRequest) {
        ExperienceResponse result = rabbitService.sendExperienceMessage(experienceRequest);
        if (result == null) {
            throw new RuntimeException("Error processing experience");
        }
        return result;
    }

//    @PostMapping("/send/summary")
//    public String sendSummary(@RequestBody List<QuestionAnswer> qnaList) {
//        rabbitService.sendSummaryMessage(qnaList);
//        return "Summary message sent: " + qnaList;
//    }
//
//    @PostMapping("/send/retrospective")
//    public String sendRetrospective(@RequestBody List<DailyLog> dailyLogs) {
//        rabbitService.sendRetrospectiveMessage(dailyLogs);
//        return "Retrospective message sent: " + dailyLogs;
//    }
//
//    @PostMapping("/send/experience")
//    public String sendExperience(@RequestBody ExperienceRequest experienceRequest) {
//        rabbitService.sendExperienceMessage(experienceRequest);
//        return "Experience message sent: " + experienceRequest.getRetrospectiveContent() + ", Keywords: " + experienceRequest.getKeywords();
//    }
}
