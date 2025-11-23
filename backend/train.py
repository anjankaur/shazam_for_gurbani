"""
Training script to fingerprint audio files and build the recognition database.
"""
import os
import sys
from dejavu import Dejavu
from config import DATABASE_CONFIG
from models import ShabadMapping


def extract_metadata_from_filename(filename):
    """
    Extract Shabad ID and artist name from filename.
    Expected format: {shabad_id}_{artist_name}.mp3
    """
    name_without_ext = filename.rsplit('.', 1)[0]
    parts = name_without_ext.split('_', 1)
    
    shabad_id = parts[0] if parts else None
    artist_name = parts[1] if len(parts) > 1 else None
    
    return shabad_id, artist_name


def train_audio_directory(audio_directory, extensions=None):
    """
    Train the system by fingerprinting all audio files in a directory.
    
    Args:
        audio_directory: Path to directory containing audio files
        extensions: List of file extensions to process (default: ['.mp3', '.wav'])
    """
    if extensions is None:
        extensions = ['.mp3', '.wav', '.m4a']
    
    if not os.path.exists(audio_directory):
        print(f"Error: Directory '{audio_directory}' does not exist.")
        print("Please create the directory and add your audio files.")
        return
    
    # Initialize Dejavu
    print("Initializing Dejavu...")
    djv = Dejavu(DATABASE_CONFIG)
    
    # Initialize mapping
    mapping = ShabadMapping()
    
    # Get all audio files
    audio_files = []
    for root, dirs, files in os.walk(audio_directory):
        for file in files:
            if any(file.lower().endswith(ext) for ext in extensions):
                audio_files.append(os.path.join(root, file))
    
    if not audio_files:
        print(f"No audio files found in '{audio_directory}'")
        print(f"Supported formats: {', '.join(extensions)}")
        return
    
    print(f"\nFound {len(audio_files)} audio file(s) to process...")
    
    # Fingerprint all files
    print("\nFingerprinting audio files...")
    djv.fingerprint_directory(audio_directory, extensions)
    
    # Create mappings for each file
    print("\nCreating Shabad mappings...")
    for audio_file in audio_files:
        filename = os.path.basename(audio_file)
        shabad_id, artist_name = extract_metadata_from_filename(filename)
        
        if shabad_id:
            mapping.add_mapping(filename, shabad_id, artist_name)
            print(f"  ✓ Mapped: {filename} -> Shabad ID {shabad_id}")
        else:
            print(f"  ⚠ Warning: Could not extract Shabad ID from '{filename}'")
    
    mapping.close()
    print("\n✅ Training complete!")
    print(f"   Processed {len(audio_files)} file(s)")
    print(f"   Database: {DATABASE_CONFIG['db']}")


if __name__ == "__main__":
    # Default audio directory (relative to project root)
    default_audio_dir = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "audio_files"
    )
    
    # Allow custom directory as command line argument
    audio_directory = sys.argv[1] if len(sys.argv) > 1 else default_audio_dir
    
    print("=" * 60)
    print("Gurbani Audio Recognition - Training Script")
    print("=" * 60)
    print(f"\nAudio directory: {audio_directory}")
    print(f"Database: {DATABASE_CONFIG['db']}@{DATABASE_CONFIG['host']}")
    print("\n" + "-" * 60)
    
    train_audio_directory(audio_directory)

