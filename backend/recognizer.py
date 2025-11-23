"""
Audio recognition module using Dejavu.
"""
import os
from dejavu import Dejavu
from dejavu.logic.recognizer.file_recognizer import FileRecognizer
from config import DATABASE_CONFIG
from models import ShabadMapping


class GurbaniRecognizer:
    """Handles audio recognition for Gurbani Shabads."""
    
    def __init__(self):
        """Initialize Dejavu and Shabad mapping."""
        self.dejavu = Dejavu(DATABASE_CONFIG)
        self.mapping = ShabadMapping()
    
    def recognize(self, audio_file_path):
        """
        Recognize a Shabad from an audio file.
        
        Args:
            audio_file_path: Path to the audio file to recognize
            
        Returns:
            dict: {
                'success': bool,
                'shabad_id': str or None,
                'confidence': float or None,
                'song_name': str or None,
                'message': str
            }
        """
        try:
            # Check if file exists
            if not os.path.exists(audio_file_path):
                return {
                    'success': False,
                    'shabad_id': None,
                    'confidence': None,
                    'song_name': None,
                    'message': f'Audio file not found: {audio_file_path}'
                }
            
            # Recognize the audio
            result = self.dejavu.recognize(FileRecognizer, audio_file_path)
            
            if result and 'song_name' in result:
                song_name = result['song_name']
                confidence = result.get('confidence', 0.0)
                
                # Extract Shabad ID from mapping or filename
                shabad_id = self.mapping.get_shabad_id(song_name)
                
                if shabad_id:
                    return {
                        'success': True,
                        'shabad_id': shabad_id,
                        'confidence': confidence,
                        'song_name': song_name,
                        'message': 'Shabad identified successfully'
                    }
                else:
                    return {
                        'success': False,
                        'shabad_id': None,
                        'confidence': confidence,
                        'song_name': song_name,
                        'message': 'Audio recognized but Shabad ID not found in mapping'
                    }
            else:
                return {
                    'success': False,
                    'shabad_id': None,
                    'confidence': None,
                    'song_name': None,
                    'message': 'No match found in database'
                }
                
        except Exception as e:
            return {
                'success': False,
                'shabad_id': None,
                'confidence': None,
                'song_name': None,
                'message': f'Recognition error: {str(e)}'
            }
    
    def close(self):
        """Clean up resources."""
        self.mapping.close()

