package com.ssafy.bbogle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class BbogleApplication {

	public static void main(String[] args) {
		SpringApplication.run(BbogleApplication.class, args);
	}

}
