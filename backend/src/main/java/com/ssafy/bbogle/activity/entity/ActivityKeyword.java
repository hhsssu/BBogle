package com.ssafy.bbogle.activity.entity;

import com.ssafy.bbogle.keyword.entity.Keyword;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "activity_keyword")
public class ActivityKeyword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id")
    private Activity activity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keyword_id")
    private Keyword keyword;

    public static ActivityKeyword addActivityKeyword(Activity activity, Keyword keyword){
        ActivityKeyword activityKeyword = ActivityKeyword.builder()
            .activity(activity)
            .keyword(keyword)
            .build();
        activity.getActivityKeywords().add(activityKeyword);
        return activityKeyword;
    }

}
