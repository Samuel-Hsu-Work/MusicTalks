# python-worker/worker.py
import schedule
import requests
import time
import os
from datetime import datetime
import sentry_sdk
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Sentry
sentry_sdk.init(
    dsn=os.getenv('SENTRY_DSN'),
    environment=os.getenv('NODE_ENV', 'production'),
    traces_sample_rate=1.0,  # 100% trace all transactions (production can reduce to 0.1-0.2)
    profiles_sample_rate=1.0,  # Performance profiling sample rate
)

# Get configuration from environment variables
API_URL = os.getenv('API_URL', 'http://localhost:3001')
CRON_SECRET = os.getenv('CRON_SECRET', 'your-secret-key')

def generate_topic():
    """Call backend API to generate a topic"""
    # Create Sentry transaction tracking
    with sentry_sdk.start_transaction(op="cron_job", name="generate_topic"):
        try:
            print(f"🕐 {datetime.now()} - Starting topic generation...")
            
            # Add breadcrumb logging
            sentry_sdk.add_breadcrumb(
                category='worker',
                message='Starting topic generation',
                level='info',
            )
            
            # Call backend API
            response = requests.post(
                f'{API_URL}/api/cron/generate-topic',
                headers={
                    'x-cron-secret': CRON_SECRET,
                    'Content-Type': 'application/json'
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Topic generated successfully: {result}")
                
                # Log success breadcrumb
                sentry_sdk.add_breadcrumb(
                    category='worker',
                    message='Topic generated successfully',
                    level='info',
                    data=result
                )
            else:
                print(f"❌ Generation failed: {response.status_code} - {response.text}")
                
                # Capture non-200 status codes as errors
                sentry_sdk.capture_message(
                    f"Topic generation failed with status {response.status_code}",
                    level='error',
                    extras={
                        'status_code': response.status_code,
                        'response_text': response.text,
                        'api_url': API_URL
                    }
                )
                
        except requests.exceptions.Timeout as e:
            print(f"❌ Request timeout: {str(e)}")
            sentry_sdk.capture_exception(e)
            
        except requests.exceptions.ConnectionError as e:
            print(f"❌ Cannot connect to backend: {API_URL}")
            sentry_sdk.capture_exception(e)
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Request error: {str(e)}")
            sentry_sdk.capture_exception(e)
            
        except Exception as e:
            print(f"❌ Unexpected error occurred: {str(e)}")
            sentry_sdk.capture_exception(e)

def health_check():
    """Health check"""
    try:
        print(f"💓 Worker running - {datetime.now()}")
        
        # Add breadcrumb
        sentry_sdk.add_breadcrumb(
            category='health_check',
            message='Health check executed',
            level='info',
        )
        
    except Exception as e:
        print(f"❌ Health check failed: {str(e)}")
        sentry_sdk.capture_exception(e)

# Set schedule - Generate topic every hour
schedule.every().hour.do(generate_topic)

# Health check every hour
schedule.every().hour.do(health_check)

if __name__ == "__main__":
    try:
        print("🚀 Python Worker started successfully!")
        print(f"📍 Target API: {API_URL}")
        print(f"⏰ Schedule: Generate topic every hour")
        print(f"🔍 Sentry monitoring: {'Enabled' if os.getenv('SENTRY_DSN') else 'Disabled'}")
        
        # Send startup event to Sentry
        sentry_sdk.capture_message(
            "Python Worker started successfully",
            level='info',
            extras={
                'api_url': API_URL,
                'schedule': 'Every hour'
            }
        )
        
        # Run immediately on startup
        generate_topic()
        
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
            
    except KeyboardInterrupt:
        print("\n👋 Worker shutting down normally")
        sentry_sdk.capture_message("Worker shutdown", level='info')
        
    except Exception as e:
        print(f"❌ Worker encountered a critical error: {str(e)}")
        sentry_sdk.capture_exception(e)
        raise
    finally:
        # Ensure Sentry sends all events
        sentry_sdk.flush(timeout=2)
