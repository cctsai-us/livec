"""
Country model for multilingual country data
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from ..db.session import Base


class Country(Base):
    """Country model with multilingual names"""

    __tablename__ = "countries"

    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Country identifiers
    country_code = Column(String(2), unique=True, nullable=False, index=True)  # ISO 3166-1 alpha-2
    dial_code = Column(String(10), nullable=False)  # +1, +886, etc.

    # Multilingual names
    name_en = Column(String(100), nullable=False)      # English
    name_zh_tw = Column(String(100), nullable=False)   # Traditional Chinese
    name_zh_cn = Column(String(100), nullable=False)   # Simplified Chinese
    name_th = Column(String(100), nullable=False)      # Thai
    name_ja = Column(String(100), nullable=False)      # Japanese

    # Display properties
    flag_emoji = Column(String(10), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def get_name(self, language: str = "en") -> str:
        """
        Get country name in specified language

        Args:
            language: Language code (en, zh_TW, zh_CN, th, ja)

        Returns:
            Country name in requested language
        """
        language_map = {
            "en": self.name_en,
            "zh_TW": self.name_zh_tw,
            "zh_CN": self.name_zh_cn,
            "th": self.name_th,
            "ja": self.name_ja,
        }
        return language_map.get(language, self.name_en)

    def to_dict(self, language: str = "en") -> dict:
        """
        Convert to dictionary for API response

        Args:
            language: Language code for name field

        Returns:
            Dictionary representation
        """
        return {
            "country_code": self.country_code,
            "dial_code": self.dial_code,
            "name": self.get_name(language),
            "flag_emoji": self.flag_emoji,
        }

    def __repr__(self):
        return f"<Country(code={self.country_code}, name_en={self.name_en})>"
