package com.phishguard.phishguard;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.io.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PhishGuardController {

    @GetMapping("/analyze")
    public ResponseEntity<String> analyzeUrl(@RequestParam String url) {
        try {
            // Path to your R script
            String rScriptPath = "C:/Users/mahla/Downloads/phishguard/phishguard/r/phishing_analysis.R";
            
            System.out.println("Looking for R script at: " + rScriptPath);
            
            // Run R script with the URL as argument
            ProcessBuilder pb = new ProcessBuilder(
                "C:/PROGRA~2/R/R-43~1.1/bin/x64/Rscript.exe", 
                rScriptPath, 
                url
            );
            pb.redirectErrorStream(true);
            Process process = pb.start();
            
            // Read output
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream())
            );
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
            
            int exitCode = process.waitFor();
            System.out.println("R script exit code: " + exitCode);
            System.out.println("R script output: " + output.toString());
            
            if (exitCode == 0) {
                return ResponseEntity.ok(output.toString());
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"R script failed with exit code: " + exitCode + "\"}");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"" + e.getMessage().replace("\"", "\\\"") + "\"}");
        }
    }
}