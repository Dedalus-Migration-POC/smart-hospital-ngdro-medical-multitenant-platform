export const APP_CONFIG = {
    "name": "<string>",
    "favicon": "<string>",
    "theme": {
        "colors": {
            "primary": "<string>",
            "secondary": "<string>",
            "accent": "<string>",
            "success": "<string>",
            "warning": "<string>",
            "danger": "<string>",
            "info": "<string>",
            "light": "<string>",
            "dark": "<string>"
        },
        "typography": {
            "fontFamily": "Titillium Web, sans-serif",
            "fontSize": {
                "small": "16px",
                "normal": "14px",
                "large": "18px",
                "extraLarge": "20px"
            },
            "lineHeight": {
                "base": 1.5
            },
            "fontWeight": {
                "normal": 400,
                "semibold": 500,
                "bold": 700
            }
        }
    },
    "translate?": {
        "googleTranslate?": {
            "supportedLanguages": ["it", "en"]
        },
        "i18n?": {
            "defaultLanguage": "it",
            "supportedLanguages": ["it", "en"]
        }
    },
    "header": "<object>",
    "footer": "<object>",
    "pages": [
        {
            "id": "<string>",
            "route": "<string>",
            "page": "<object>"
        }
    ]
}