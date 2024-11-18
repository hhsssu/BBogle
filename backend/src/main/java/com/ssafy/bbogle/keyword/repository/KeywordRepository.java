package com.ssafy.bbogle.keyword.repository;

import com.ssafy.bbogle.keyword.entity.Keyword;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KeywordRepository extends JpaRepository<Keyword, Integer>, KeywordRepositoryCustom {

}
