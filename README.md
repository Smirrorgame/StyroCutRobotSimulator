# StyroCutRobotSimulator
Dieses Programm simuliert den im Projekt [StyroCutRobot](https://github.com/Smirrorgame/StyroCutRobot) benutzten Roboter und stellt relevante Koordinatensysteme grafisch dar. Man kann sich dann mit dem eben genannten Programm StyroCutRobot dort verbinden und einfache Befehle senden, die visuell in einer 3D Umgebung dargestellt werden.
Das Programm wurde in JavaScript mit [Node.js](https://nodejs.org/en/) geschrieben und für die vereinfachte grafische Darstellung wurde die [p5.js](https://p5js.org/) und die [p5.EasyCam](https://freshfork.github.io/p5.EasyCam/) Library genutzt. Dementsprechend läuft diese Anwendung im Browser.

## Features
1. Bedienbare 3D-Umgebung im Browser
2. TCP-Server an Port 5005 und 5000 für das [StyroCutRobot](https://github.com/Smirrorgame/StyroCutRobot) Programm
3. Senden von Endeffektorpositionen
4. Abfragen von Endeffektorpositionen
5. Abfragen von Markerposition

## Installation
1. Zum Ausführen wird [Node.js](https://nodejs.org/en/download/) benötigt.
2. Zum Ausführen ein Terminal/Kommandozeile im Ordner öffnen, wo sich die server.js befindet
3. Zuerst müssen die node_modules mit 'npm install' installiert werden
4. Nun 'node server.js' eingeben und das Programm wird gestartet
5. http://localhost:3000 im Browser öffnen
6. Zusätzlich kann das [StyroCutRobot](https://github.com/Smirrorgame/StyroCutRobot) Programm gestartet und mit dem Server verbunden werden

## StyroCutRobot
Seit dem neuesten Update wurde der Halte-Roboter eingebaut. Nun ist es möglich in dieser WebApp die Position des Markers via Checkbox zu bestimmen (Schneide- oder Halte-Roboter), um die jeweiligen Roboter kalibrieren zu können.<br>
Wichtig ist, dass <b>zuerst</b> mit dem Schneide-Roboter und dann mit dem Halte-Roboter verbunden wird.<br>
Diese Reihenfolge ist fest einprogrammiert, da es nicht möglich ist zu unterscheiden, zu welchem Roboter zuerst verbunden wurde.
