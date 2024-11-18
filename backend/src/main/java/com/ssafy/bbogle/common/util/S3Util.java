package com.ssafy.bbogle.common.util;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@RequiredArgsConstructor
public class S3Util {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    // 최대 파일 크기 설정 (5MB)
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    // 허용하는 파일 타입 설정
    private static final List<String> ALLOWED_TYPES = Arrays.asList("image/jpeg", "image/png");

    public String upload(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다. 유효한 파일을 업로드해 주세요.");
        }

//        // 파일 타입 검증
//        if (!ALLOWED_TYPES.contains(file.getContentType())) {
//            throw new IllegalArgumentException("허용되지 않는 파일 형식입니다. JPEG와 PNG 형식만 지원됩니다.");
//        }

        // 파일 크기 검증
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("파일 크기가 5MB를 초과할 수 없습니다.");
        }

//        String fileName = generateFileName(file.getOriginalFilename());
//
//        // 이미지 리사이징 및 JPEG 형식으로 변환
//        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//        Thumbnails.of(file.getInputStream())
//            .size(500, 500)  // 정사각형 사이즈로 리사이징
//            .outputFormat("jpeg")  // JPEG 형식으로 설정
//            .outputQuality(0.7)  // 품질 설정 (70%)
//            .toOutputStream(outputStream);
//
//        // 리사이즈된 이미지 데이터 생성
//        byte[] imageData = outputStream.toByteArray();
//
//        // 메타데이터 설정 - JPEG 타입으로 명시
//        ObjectMetadata metadata = new ObjectMetadata();
//        metadata.setContentType("image/jpeg");
//        metadata.setContentLength(imageData.length);
//
//        // Amazon S3에 업로드
//        ByteArrayInputStream inputStream = new ByteArrayInputStream(imageData);
//
//        PutObjectRequest putRequest = new PutObjectRequest(bucket, fileName, inputStream, metadata);
//        amazonS3.putObject(putRequest);
//
//        return amazonS3.getUrl(bucket, fileName).toString();

        String fileName = generateFileName(file.getOriginalFilename());
        amazonS3.putObject(new PutObjectRequest(bucket, fileName, file.getInputStream(), null));
        return amazonS3.getUrl(bucket, fileName).toString();
    }

    public void deleteFile(String fileUrl) {
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        amazonS3.deleteObject(bucket, fileName);
    }

    private String generateFileName(String originalFileName) {
        return UUID.randomUUID().toString() + "_" + originalFileName;
    }

}
