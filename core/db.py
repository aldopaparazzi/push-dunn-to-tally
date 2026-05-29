from pathlib import Path
import duckdb

DB_PATH = Path("data/db/sensoriel.duckdb")


def get_connection():
    return duckdb.connect(str(DB_PATH))