-- Migration: Create countries table with multilingual support
-- Date: 2025-01-13
-- Description: Creates countries table with names in multiple languages

CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL UNIQUE,  -- ISO 3166-1 alpha-2 code
    dial_code VARCHAR(10) NOT NULL,            -- Phone dial code (e.g., +1, +886)
    name_en VARCHAR(100) NOT NULL,             -- English name
    name_zh_tw VARCHAR(100) NOT NULL,          -- Traditional Chinese name
    name_zh_cn VARCHAR(100) NOT NULL,          -- Simplified Chinese name
    name_th VARCHAR(100) NOT NULL,             -- Thai name
    name_ja VARCHAR(100) NOT NULL,             -- Japanese name
    flag_emoji VARCHAR(10),                    -- Unicode flag emoji
    is_active BOOLEAN DEFAULT TRUE NOT NULL,   -- Enable/disable countries
    display_order INTEGER DEFAULT 0,           -- Sort order in UI
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on country_code for faster lookups
CREATE INDEX idx_countries_country_code ON countries(country_code);
CREATE INDEX idx_countries_is_active ON countries(is_active);

-- Insert supported countries
INSERT INTO countries (country_code, dial_code, name_en, name_zh_tw, name_zh_cn, name_th, name_ja, flag_emoji, display_order) VALUES
('US', '+1', 'United States', '美國', '美国', 'สหรัฐอเมริกา', 'アメリカ合衆国', '🇺🇸', 1),
('TW', '+886', 'Taiwan', '台灣', '台湾', 'ไต้หวัน', '台湾', '🇹🇼', 2),
('CN', '+86', 'China', '中國', '中国', 'จีน', '中国', '🇨🇳', 3),
('TH', '+66', 'Thailand', '泰國', '泰国', 'ประเทศไทย', 'タイ', '🇹🇭', 4),
('JP', '+81', 'Japan', '日本', '日本', 'ญี่ปุ่น', '日本', '🇯🇵', 5);

-- Add comments
COMMENT ON TABLE countries IS 'Supported countries for phone registration';
COMMENT ON COLUMN countries.country_code IS 'ISO 3166-1 alpha-2 country code';
COMMENT ON COLUMN countries.dial_code IS 'International dial code with + prefix';
COMMENT ON COLUMN countries.display_order IS 'Order to display in dropdown (lower = first)';
