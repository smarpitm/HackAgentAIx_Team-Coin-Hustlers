# Requirements Document

## Introduction

AccessIndia AI is a multi-agent accessibility platform designed for people with disabilities in India. The system provides vision assistance, communication support, navigation guidance, and accessibility auditing through specialized AI agents orchestrated by a central routing system. The platform uses Google Generative AI (Gemini 1.5 Flash) for all AI capabilities, with a FastAPI backend and React frontend optimized for full accessibility compliance.

## Glossary

- **System**: The complete AccessIndia AI platform (backend + frontend)
- **Backend**: Python FastAPI server with AI agents
- **Frontend**: React web application with dark theme UI
- **Orchestrator_Agent**: AI agent that classifies user intent and routes requests
- **Vision_Agent**: AI agent that analyzes images for OCR, scene description, and object detection
- **Communication_Agent**: AI agent that provides speech-to-text, text-to-speech, and sign language detection
- **Navigation_Agent**: AI agent that provides wheelchair-friendly routes and accessible facility locations
- **Accessibility_Audit_Agent**: AI agent that scores building images for wheelchair accessibility
- **Config_Module**: Python module that manages environment variables and application settings
- **User**: Person with disability using the platform
- **Gemini_API**: Google Generative AI (Gemini 1.5 Flash) service
- **Google_Maps_API**: Google Maps JavaScript API for directions and places
- **CORS_Origins**: Allowed frontend origins for Cross-Origin Resource Sharing
- **Settings_Object**: Singleton configuration instance loaded from environment variables

## Requirements

### Requirement 1: Configuration Management Module

**User Story:** As a backend developer, I want a centralized configuration management system, so that I can securely manage API keys and application settings across all agents.

#### Acceptance Criteria

1. THE Config_Module SHALL use pydantic-settings BaseSettings for environment variable management
2. THE Config_Module SHALL define a GEMINI_API_KEY field of type string with no default value
3. THE Config_Module SHALL define a GOOGLE_MAPS_API_KEY field of type string with no default value
4. THE Config_Module SHALL define a CORS_ORIGINS field of type list with default value ["http://localhost:5173"]
5. THE Config_Module SHALL implement lru_cache decorator with maxsize=1 for singleton pattern
6. THE Config_Module SHALL provide a get_settings function that returns the Settings_Object
7. WHEN the Config_Module is imported multiple times, THE get_settings function SHALL return the same Settings_Object instance
8. THE Config_Module SHALL load environment variables from a .env file in the project root
9. THE Config_Module SHALL include type hints for all fields and return values
10. IF a required field (GEMINI_API_KEY or GOOGLE_MAPS_API_KEY) is missing, THEN THE Config_Module SHALL raise a ValidationError with a descriptive message

### Requirement 2: Settings Object Structure

**User Story:** As a backend developer, I want structured access to configuration values, so that I can use type-safe configuration throughout the application.

#### Acceptance Criteria

1. THE Settings_Object SHALL inherit from pydantic_settings.BaseSettings
2. THE Settings_Object SHALL use model_config with env_file=".env" and env_file_encoding="utf-8"
3. THE Settings_Object SHALL expose gemini_api_key as a string property
4. THE Settings_Object SHALL expose google_maps_api_key as a string property
5. THE Settings_Object SHALL expose cors_origins as a list of strings property
6. WHEN accessed, THE Settings_Object properties SHALL return the values loaded from environment variables
7. THE Settings_Object SHALL validate field types on initialization
8. IF CORS_ORIGINS environment variable is not set, THEN THE Settings_Object SHALL use the default value ["http://localhost:5173"]

### Requirement 3: Type Safety and Validation

**User Story:** As a backend developer, I want type-safe configuration access, so that I can catch configuration errors at startup rather than at runtime.

#### Acceptance Criteria

1. THE Config_Module SHALL use Python type hints for all function signatures
2. THE Config_Module SHALL validate GEMINI_API_KEY is a non-empty string
3. THE Config_Module SHALL validate GOOGLE_MAPS_API_KEY is a non-empty string
4. THE Config_Module SHALL validate CORS_ORIGINS contains valid URL strings
5. WHEN the Backend starts, THE Config_Module SHALL validate all required fields before allowing requests
6. IF validation fails, THEN THE Config_Module SHALL raise pydantic.ValidationError with specific field errors
7. THE Config_Module SHALL include docstrings for the Settings class and get_settings function

### Requirement 4: Environment Variable Loading

**User Story:** As a developer, I want automatic environment variable loading, so that I don't need to manually configure settings for different environments.

#### Acceptance Criteria

1. WHEN the Backend starts, THE Config_Module SHALL attempt to load a .env file from the project root
2. IF a .env file exists, THEN THE Config_Module SHALL parse it with UTF-8 encoding
3. IF a .env file does not exist, THEN THE Config_Module SHALL load from system environment variables
4. THE Config_Module SHALL prioritize system environment variables over .env file values
5. THE Config_Module SHALL support CORS_ORIGINS as a comma-separated string in environment variables
6. WHEN CORS_ORIGINS contains comma-separated values, THE Config_Module SHALL parse them into a list

### Requirement 5: Singleton Pattern Implementation

**User Story:** As a backend developer, I want a single shared configuration instance, so that I avoid redundant environment variable parsing and ensure consistency.

#### Acceptance Criteria

1. THE get_settings function SHALL use functools.lru_cache with maxsize=1
2. WHEN get_settings is called multiple times, THE Config_Module SHALL return the identical Settings_Object instance
3. THE Config_Module SHALL instantiate Settings_Object only once during application lifetime
4. THE Config_Module SHALL cache the Settings_Object in memory
5. THE Config_Module SHALL allow import and reuse across multiple Python modules without re-initialization

### Requirement 6: Integration with FastAPI

**User Story:** As a backend developer, I want FastAPI dependency injection support, so that I can access settings in route handlers cleanly.

#### Acceptance Criteria

1. THE get_settings function SHALL be compatible with FastAPI Depends() injection
2. WHEN used with Depends(get_settings), THE Config_Module SHALL provide the Settings_Object to route handlers
3. THE Config_Module SHALL not block FastAPI application startup
4. THE Config_Module SHALL raise configuration errors before the FastAPI app accepts requests
5. THE Config_Module SHALL allow settings access in FastAPI lifespan events

### Requirement 7: Security and Best Practices

**User Story:** As a security-conscious developer, I want secure handling of sensitive configuration data, so that API keys are not exposed or logged accidentally.

#### Acceptance Criteria

1. THE Config_Module SHALL mark GEMINI_API_KEY and GOOGLE_MAPS_API_KEY fields with pydantic SecretStr type
2. WHEN Settings_Object is printed or logged, THE Config_Module SHALL hide API key values
3. THE Config_Module SHALL never write API keys to stdout or log files by default
4. THE Config_Module SHALL expose API key values only through explicit .get_secret_value() calls
5. THE Config_Module SHALL include inline comments warning about sensitive data handling

### Requirement 8: CORS Origins Configuration

**User Story:** As a frontend developer, I want configurable CORS origins, so that I can connect the React frontend from different environments (local, staging, production).

#### Acceptance Criteria

1. THE CORS_ORIGINS field SHALL accept a list of valid HTTP/HTTPS URLs
2. THE Config_Module SHALL validate each CORS_ORIGINS entry is a properly formatted URL
3. THE default CORS_ORIGINS value SHALL include "http://localhost:5173" for local development
4. WHEN deployed to production, THE Config_Module SHALL allow setting CORS_ORIGINS via environment variable
5. THE Config_Module SHALL support multiple CORS origins separated by commas in the environment variable

### Requirement 9: Error Messages and Debugging

**User Story:** As a developer, I want clear error messages for configuration problems, so that I can quickly diagnose and fix environment setup issues.

#### Acceptance Criteria

1. IF GEMINI_API_KEY is missing, THEN THE Config_Module SHALL raise ValidationError with message "GEMINI_API_KEY is required"
2. IF GOOGLE_MAPS_API_KEY is missing, THEN THE Config_Module SHALL raise ValidationError with message "GOOGLE_MAPS_API_KEY is required"
3. IF CORS_ORIGINS contains invalid URLs, THEN THE Config_Module SHALL raise ValidationError with details about which URL is invalid
4. THE Config_Module SHALL include the field name in all validation error messages
5. THE Config_Module SHALL not expose actual API key values in error messages

### Requirement 10: Module Structure and Imports

**User Story:** As a backend developer, I want clean module organization, so that I can import and use the config module easily across the application.

#### Acceptance Criteria

1. THE Config_Module SHALL be located at backend/app/config.py
2. THE Config_Module SHALL import BaseSettings from pydantic_settings
3. THE Config_Module SHALL import lru_cache from functools
4. THE Config_Module SHALL import SecretStr from pydantic
5. THE Config_Module SHALL export the Settings class and get_settings function
6. WHEN imported, THE Config_Module SHALL not execute any side effects (no immediate API calls or file writes)
7. THE Config_Module SHALL be compatible with Python 3.11+
