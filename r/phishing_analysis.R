# phishing_analysis.R
args <- commandArgs(trailingOnly = TRUE)
url <- args[1]

# Simple phishing detection rules
score <- 0
warnings <- c()

# Check for suspicious patterns
if (grepl("secure|verify|account|login|update|confirm|banking|paypal|amazon|microsoft|apple", url, ignore.case = TRUE)) {
  score <- score + 20
  warnings <- c(warnings, "Contains suspicious keywords")
}

if (grepl("\\d{5,}", url)) {
  score <- score + 15
  warnings <- c(warnings, "Contains long number sequence")
}

if (grepl("http://", url)) {
  score <- score + 10
  warnings <- c(warnings, "No HTTPS")
}

if (grepl("-", url)) {
  score <- score + 5
  warnings <- c(warnings, "Contains hyphens")
}

if (grepl("\\.xyz|\\.top|\\.tk|\\.ml|\\.ga|\\.cf", url, ignore.case = TRUE)) {
  score <- score + 25
  warnings <- c(warnings, "Suspicious domain extension")
}

if (grepl("//.*\\.", url) && !grepl("//[^/]*\\.", url)) {
  score <- score + 10
  warnings <- c(warnings, "Multiple subdomains")
}

# Determine risk level
risk_level <- ifelse(score >= 50, "High Risk", 
                     ifelse(score >= 30, "Medium Risk", "Low Risk"))

# Output JSON
cat(jsonlite::toJSON(list(
  url = url,
  risk_score = score,
  risk_level = risk_level,
  warnings = warnings
), auto_unbox = TRUE))
