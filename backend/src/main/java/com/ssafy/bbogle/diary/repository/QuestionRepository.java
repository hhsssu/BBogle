package com.ssafy.bbogle.diary.repository;

import com.ssafy.bbogle.diary.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findAllByOrderById();
}
