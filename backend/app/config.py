"""
Application configuration management
DEPRECATED: This module is kept for backward compatibility only.
Use 'from config import config' instead of 'from app.config import settings'
"""
import warnings

# Import from new config system
from config import config as settings

# Show deprecation warning when this module is imported
warnings.warn(
    "app.config is deprecated. Please use 'from config import config' instead of 'from app.config import settings'",
    DeprecationWarning,
    stacklevel=2
)

# For backward compatibility, export settings
__all__ = ['settings']
