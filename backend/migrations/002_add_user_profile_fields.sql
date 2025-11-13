-- Migration: Add user profile fields for phone registration
-- Date: 2025-01-13
-- Description: Adds first_name, last_name, nickname, gender, and date_of_birth to users table

ALTER TABLE users ADD COLUMN first_name VARCHAR(50);
ALTER TABLE users ADD COLUMN last_name VARCHAR(50);
ALTER TABLE users ADD COLUMN nickname VARCHAR(50);
ALTER TABLE users ADD COLUMN gender VARCHAR(20);
ALTER TABLE users ADD COLUMN date_of_birth VARCHAR(8);
