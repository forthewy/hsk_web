package com.jane.hskweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class HskWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(HskWebApplication.class, args);
    }

}
