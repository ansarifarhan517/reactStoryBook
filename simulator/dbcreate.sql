CREATE DATABASE loadtest_results;

CREATE TABLE IF NOT EXISTS api_call_report (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_name VARCHAR(256),
    method VARCHAR(10) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    api VARCHAR(255) NOT NULL,
    session_id BIGINT,
    client_id VARCHAR(50) NOT NULL,
    starttime BIGINT NOT NULL,
    endtime BIGINT ,
    responseCode INT NOT NULL,
    responseTime INT,
    responseSize INT );


