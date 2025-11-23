"""
Database models for storing Shabad metadata and mappings.
"""
import mysql.connector
from mysql.connector import Error
from config import DATABASE_CONFIG


class ShabadMapping:
    """Handles mapping between audio files and Shabad IDs."""
    
    def __init__(self):
        self.connection = None
        self._connect()
        self._create_tables()
    
    def _connect(self):
        """Establish database connection."""
        try:
            self.connection = mysql.connector.connect(
                host=DATABASE_CONFIG["host"],
                user=DATABASE_CONFIG["user"],
                password=DATABASE_CONFIG["password"],
                database=DATABASE_CONFIG["db"]
            )
        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            raise
    
    def _create_tables(self):
        """Create mapping table if it doesn't exist."""
        cursor = self.connection.cursor()
        create_table_query = """
        CREATE TABLE IF NOT EXISTS shabad_mappings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            audio_filename VARCHAR(255) UNIQUE NOT NULL,
            shabad_id VARCHAR(50) NOT NULL,
            artist_name VARCHAR(255),
            start_ang INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_shabad_id (shabad_id),
            INDEX idx_filename (audio_filename)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """
        cursor.execute(create_table_query)
        self.connection.commit()
        cursor.close()
    
    def add_mapping(self, audio_filename, shabad_id, artist_name=None, start_ang=None):
        """Add a new audio-to-shabad mapping."""
        cursor = self.connection.cursor()
        insert_query = """
        INSERT INTO shabad_mappings (audio_filename, shabad_id, artist_name, start_ang)
        VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            shabad_id = VALUES(shabad_id),
            artist_name = VALUES(artist_name),
            start_ang = VALUES(start_ang)
        """
        cursor.execute(insert_query, (audio_filename, shabad_id, artist_name, start_ang))
        self.connection.commit()
        cursor.close()
    
    def get_shabad_id(self, audio_filename):
        """Get Shabad ID from audio filename."""
        cursor = self.connection.cursor()
        select_query = "SELECT shabad_id FROM shabad_mappings WHERE audio_filename = %s"
        cursor.execute(select_query, (audio_filename,))
        result = cursor.fetchone()
        cursor.close()
        
        if result:
            return result[0]
        
        # Fallback: Try to extract from filename (format: {shabad_id}_{artist}.mp3)
        try:
            filename_without_ext = audio_filename.rsplit('.', 1)[0]
            shabad_id = filename_without_ext.split('_')[0]
            if shabad_id.isdigit():
                return shabad_id
        except:
            pass
        
        return None
    
    def close(self):
        """Close database connection."""
        if self.connection and self.connection.is_connected():
            self.connection.close()

