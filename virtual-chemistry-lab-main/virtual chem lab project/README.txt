🧪 Virtual Chemistry Lab
An interactive web-based chemistry lab where students can drag and drop chemicals into beakers, perform experiments, and view history — all without needing a physical lab.  

❓ What is this project?
The Virtual Chemistry Lab is a digital platform that simulates a real chemistry lab.  
Students can select chemicals, drag them into beakers, mix them, and observe outcomes.  
It eliminates the need for physical equipment while still providing a hands-on learning experience.  


 💡 Why this project?
- To make chemistry learning accessible without a physical lab.  
- To reduce costs and risks of handling real chemicals.  
- To provide an interactive learning tool for students anytime, anywhere.  
- To encourage the use of technology in education.  


 ⚙️ How does it work?
1. Frontend (HTML, CSS, JavaScript)  
   - Provides the lab interface with drag-and-drop functionality.  
   - Displays chemicals with color codes (Acids, Bases, etc.).  
   - Shows the history of performed experiments.  

2. Backend (Flask + Python)  
   - Handles chemical data, experiment history, and interactions.  
   - Reads chemical details from `chemicals.json`.  
   - Stores user actions and experiment logs in SQLite database.  

3. Database (SQLite + JSON)  
   - SQLite stores experiment history.  
   - chemicals.json stores available chemicals with properties like `id`, `name`, `type`, and `color`.  


 ✨ Features
- 🎨 Drag & drop chemicals into beakers  
- 🧪 Chemicals are color-coded by type (Acid, Base, etc.)  
- 📜 View past experiments in the history page  
- 🛠️ Flask-powered backend with database integration  


 🏗️ Project Structure
 
virtual-chem-lab-project/
│── backend/
│ ├── app.py # Flask backend server
│ ├── reactions.py # Chemical reactions logic
│ ├── chemicals.json # Chemical data (id, name, type, color)
│ ├── lab.db # SQLite database
│ ├── requirements.txt # Python dependencies
│
│── frontend/
│ ├── index.html # Main lab interface
│ ├── experiment.html # Experiment workspace
│ ├── history.html # Experiment history page
│ ├── result.html # Results page
│ ├── mix.css # Styles for experiment/mixing
│ ├── style.css # Global styles
│ ├── script.js # Frontend logic (drag & drop, API calls)
│ ├── mix.js # Experiment-specific JS logic
│
│── README.md / README.txt # Project documentation
