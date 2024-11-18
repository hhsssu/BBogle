package com.ssafy.bbogle.activity.entity;

import com.ssafy.bbogle.activity.dto.request.ActivityUpdateRequest;
import com.ssafy.bbogle.keyword.entity.Keyword;
import com.ssafy.bbogle.project.entity.Project;
import com.ssafy.bbogle.user.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "activity")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = true)
    private Project project;

    @Column(name = "create_date", nullable = false)
    private LocalDate createDate;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", nullable = false, length = 1500)
    private String content;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Builder.Default
    @OneToMany(mappedBy = "activity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActivityKeyword> activityKeywords = new ArrayList<>();

    public void removeKeyword(ActivityKeyword activityKeyword) {
        this.activityKeywords.remove(activityKeyword);
    }

    public void updateActivity(ActivityUpdateRequest request, Project project){
        this.title = request.getTitle();
        this.content = request.getContent();
        this.startDate = request.getStartDate();
        this.endDate = request.getEndDate();
        this.project = project;
    }
}
