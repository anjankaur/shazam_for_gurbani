"""
Setup verification script - checks if all dependencies and configurations are correct.
"""
import sys
import os

def check_python_version():
    """Check if Python version is 3.8+"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ required. Current version:", sys.version)
        return False
    print(f"✅ Python version: {version.major}.{version.minor}.{version.micro}")
    return True

def check_dependencies():
    """Check if required Python packages are installed"""
    required = ['flask', 'flask_cors', 'dejavu', 'mysql.connector', 'dotenv']
    missing = []
    
    for package in required:
        try:
            if package == 'flask_cors':
                __import__('flask_cors')
            elif package == 'mysql.connector':
                __import__('mysql.connector')
            else:
                __import__(package)
            print(f"✅ {package} installed")
        except ImportError:
            print(f"❌ {package} not installed")
            missing.append(package)
    
    return len(missing) == 0

def check_ffmpeg():
    """Check if FFmpeg is installed"""
    import subprocess
    try:
        result = subprocess.run(['ffmpeg', '-version'], 
                              capture_output=True, 
                              text=True, 
                              timeout=5)
        if result.returncode == 0:
            version_line = result.stdout.split('\n')[0]
            print(f"✅ FFmpeg installed: {version_line}")
            return True
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass
    
    print("❌ FFmpeg not found. Install it for audio processing.")
    print("   macOS: brew install ffmpeg")
    print("   Ubuntu: sudo apt-get install ffmpeg")
    return False

def check_database():
    """Check database connection"""
    try:
        from config import DATABASE_CONFIG
        import mysql.connector
        
        conn = mysql.connector.connect(
            host=DATABASE_CONFIG['host'],
            user=DATABASE_CONFIG['user'],
            password=DATABASE_CONFIG['password'],
            database=DATABASE_CONFIG['db']
        )
        conn.close()
        print(f"✅ Database connection successful: {DATABASE_CONFIG['db']}")
        return True
    except ImportError as e:
        print(f"❌ Config error: {e}")
        return False
    except mysql.connector.Error as e:
        print(f"❌ Database connection failed: {e}")
        print("   Check your .env file and ensure MySQL is running")
        return False

def check_env_file():
    """Check if .env file exists"""
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
    if os.path.exists(env_path):
        print("✅ .env file found")
        return True
    else:
        print("⚠️  .env file not found. Copy .env.example to .env and configure it.")
        return False

def main():
    print("=" * 60)
    print("Shazam for Gurbani - Setup Verification")
    print("=" * 60)
    print()
    
    checks = [
        ("Python Version", check_python_version),
        ("Python Dependencies", check_dependencies),
        ("FFmpeg", check_ffmpeg),
        ("Environment File", check_env_file),
        ("Database Connection", check_database),
    ]
    
    results = []
    for name, check_func in checks:
        print(f"\n[{name}]")
        results.append(check_func())
    
    print("\n" + "=" * 60)
    if all(results):
        print("✅ All checks passed! You're ready to go.")
        print("\nNext steps:")
        print("  1. Add audio files to audio_files/ directory")
        print("  2. Run: python train.py")
        print("  3. Start server: python app.py")
    else:
        print("❌ Some checks failed. Please fix the issues above.")
    print("=" * 60)

if __name__ == "__main__":
    main()

