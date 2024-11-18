package com.ssafy.bbogle.diary.repository;

import com.ssafy.bbogle.diary.entity.Diary;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Integer> {

    @Query("SELECT d FROM Diary d " +
            "WHERE d.project.id = :projectId " +
            "ORDER BY d.id ASC")  // createDate DESC -> id ASC
    List<Diary> findByProject_IdOrderById(@Param("projectId") Integer projectId);

    @Query("SELECT d FROM Diary d " +
            "LEFT JOIN FETCH d.answers a " +
            "LEFT JOIN FETCH a.question " +
            "LEFT JOIN FETCH d.diaryImages " +
            "WHERE d.id = :diaryId AND d.project.id = :projectId")
    Optional<Diary> findByIdAndProject_Id(@Param("diaryId") Integer diaryId, @Param("projectId") Integer projectId);

    @Query("SELECT d FROM Diary d " +
            "LEFT JOIN FETCH d.project " +
            "WHERE d.user.kakaoId = :kakaoId " +
            "AND d.createDate = :createDate " +
            "ORDER BY d.id ASC")  // createDate DESC -> id ASC
    List<Diary> findByUser_KakaoIdAndCreateDateOrderById(
            @Param("kakaoId") Long kakaoId,
            @Param("createDate") LocalDate createDate);

    @Query("SELECT d FROM Diary d " +
            "LEFT JOIN FETCH d.answers a " +
            "LEFT JOIN FETCH a.question " +
            "LEFT JOIN FETCH d.diaryImages " +
            "WHERE d.project.id = :projectId " +
            "ORDER BY d.id ASC")  // createDate DESC -> id ASC
    List<Diary> findByProject_IdWithDetails(@Param("projectId") Integer projectId);

    @EntityGraph(attributePaths = {"answers", "answers.question", "diaryImages"})
    @Query("SELECT d FROM Diary d " +
            "WHERE d.id = :diaryId AND d.project.id = :projectId")
    Optional<Diary> findByIdAndProject_IdWithDetails(
            @Param("diaryId") Integer diaryId,
            @Param("projectId") Integer projectId);
}