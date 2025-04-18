import os
import shutil
import sys 

DATA_FOLDER = 'data'

def clear_data(is_clear_games=False):
    
    data_path = os.path.join(DATA_FOLDER, "data.json")
    empty_data_path = os.path.join(DATA_FOLDER, "empty-data.json")

    
    # clear person to photo relation
    person_to_photo_path = os.path.join(DATA_FOLDER, "person_to_photo_relation.json")
    if os.path.exists(person_to_photo_path):
        clear_json_file(person_to_photo_path)
        
    # Remove existing data.json if it exists
    if os.path.exists(data_path):
        os.remove(data_path)
        print("Deleted existing data.json")

    # Copy empty-data.json to data.json
    shutil.copy(empty_data_path, data_path)
    print("Reset data.json from empty-data.json")

    if is_clear_games:
        for filename in os.listdir(DATA_FOLDER):
            if filename.endswith(".json") and filename.startswith("game"):
                file_path = os.path.join(DATA_FOLDER, filename)
                os.remove(file_path)
                print(f"Deleted {filename}")
            
    print("All data cleared.")

def clear_json_file(file_path):
    with open(file_path, 'w') as f:
        f.write('{}')
    print(f"Cleared: {file_path}")
    
def main():
    args = sys.argv
    is_clear_games = False
    if len(args) > 1 and args[1] == "--cleargames":
        is_clear_games = True
        
    clear_data(is_clear_games=is_clear_games)
    
main()