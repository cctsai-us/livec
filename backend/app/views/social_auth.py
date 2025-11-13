"""HTML response templates for social authentication"""
from fastapi.responses import HTMLResponse


def render_success_page(provider: str) -> HTMLResponse:
    """Render OAuth success page"""
    color = "#00B900" if provider == "LINE" else "#1877F2"

    return HTMLResponse(f"""
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }}
                .container {{ background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 40px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }}
                .success-icon {{ font-size: 4rem; color: {color}; margin-bottom: 1rem; }}
                h2 {{ color: #333; margin: 0 0 0.5rem 0; }}
                p {{ color: #666; margin: 0.5rem 0; }}
                .note {{ background: #f0f0f0; padding: 1rem; border-radius: 0.5rem; margin-top: 1.5rem; font-size: 0.9rem; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="success-icon">✓</div>
                <h2>Login Successful!</h2>
                <p>You have successfully logged in with {provider}.</p>
                <div class="note">You can close this window and return to the app.<br><br>The app will automatically detect your login.</div>
            </div>
        </body>
        </html>
    """)


def render_error_page(error: str) -> HTMLResponse:
    """Render OAuth error page"""
    return HTMLResponse(f"""
        <html><body>
            <h2>Login Error</h2>
            <p>{error}</p>
            <p>You can close this window and return to the app.</p>
        </body></html>
    """)
