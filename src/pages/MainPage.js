import React, { useState, useEffect, useRef } from 'react';
import '../styles/MainPageStyles.css';
import { FaPencilAlt, FaSearch } from 'react-icons/fa';
import p5 from 'p5';

import env from "react-dotenv";

const BACKEND_URL = env.BACKEND_URL;

const generateItems = (count) => {
  let items = [];

  items.push({
    id: 'i7fg1civit5p3h5muvua90k9urbmsq9k',
    title: 'i7fg1civit5p3h5muvua90k9urbmsq9k',
    previewImage: null, // Placeholder for now
    dateUploaded: new Date().toLocaleDateString()
    });
  
  for (let i = 1; i < count; i++) {
      items.push({
          id: i,
          title: `File ${i}`,
          previewImage: null, // Placeholder for now
          dateUploaded: new Date().toLocaleDateString()
      });
  }

  return items;
};

export default function MainPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [numItems, setNumItems] = useState(20); // Default number of items
    const [items, setItems] = useState(generateItems(numItems));
    const sketchRef = useRef();
    const p5Instance = useRef(null);

    useEffect(() => {
        if (isModalOpen) {
            p5Instance.current = new p5(Sketch, sketchRef.current);
        } else {
            if (p5Instance.current) {
                const canvas = p5Instance.current.canvas;
                const base64Image = canvas.toDataURL("image/png");
                console.log(base64Image);
                
                p5Instance.current.remove(); // Clean up the sketch
                p5Instance.current = null;
            }
        }

        return () => {
            if (p5Instance.current) {
                p5Instance.current.remove(); // Ensure clean up if the component unmounts
            }
        };
    }, [isModalOpen]);

    const Sketch = (p) => {
        let currentColor = '#e81416'; // Default color (Red)
        const colors = ['#e81416', '#ffa500', '#faeb36', '#79c314', '#4b369d', '#000000', '#FFFFFF'];
        const colorPickerHeight = 40; // Height of the color picker area
        let lastX = -1;
        let lastY = -1;

        p.setup = () => {
            p.createCanvas(300, 300);
            p.background(230);
        };

        p.draw = () => {
            colors.forEach((color, index) => {
                p.noStroke();
                p.fill(color);
                p.rect(index * (p.width / colors.length), 0, p.width / colors.length, colorPickerHeight);
            });

            if (p.mouseIsPressed) {
                if (p.mouseY > colorPickerHeight) {
                    p.stroke(currentColor);
                    p.strokeWeight(5);
                    if (lastX !== -1 && lastY !== -1) {
                        p.line(lastX, lastY, p.mouseX, p.mouseY);
                    }
                    lastX = p.mouseX;
                    lastY = p.mouseY;
                } else {
                    const selectedColorIndex = Math.floor(p.mouseX / (p.width / colors.length));
                    currentColor = colors[selectedColorIndex];
                    lastX = -1; // Reset
                    lastY = -1; // Reset
                }
            } else {
                lastX = -1; // Reset on mouse release
                lastY = -1; // Reset on mouse release
            }
        };
    };

    const chooseFile = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.png, .jpg, .jpeg, .gif, .txt, .pdf, .doc, .docx';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            await uploadFile(file);
        };
        input.click();
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${BACKEND_URL}/upload-file`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData.message);
            } else {
                console.error('Failed to upload file');
                const errorResponse = await response.json();
                console.error(errorResponse.message);
            }
        } catch (error) {
            console.error('Failed to upload file', error);
        }
    };

    return (
        <div className="container">
            <button className="buttonTop uploadButton" onClick={chooseFile}>Upload File</button>
            <div className="searchBox">
                <FaSearch className="searchIcon leftIcon" />
                <input
                    type="text"
                    className="searchInput"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                />
                <FaPencilAlt className="searchIcon rightIcon" onClick={() => setIsModalOpen(true)} />
            </div>
            {isModalOpen && (
                <div className="modal">
                    <div className="modalContent">
                        <button onClick={() => setIsModalOpen(false)}>Close</button>
                        <div ref={sketchRef}></div>
                    </div>  
                </div>
            )}
            <div className="grid">
                {items.map(item => (
                    <div key={item.id} className="item">
                        <a href={`${BACKEND_URL}/get-file?id=${item.title}`} className="title">{item.title}</a>
                        <div className="previewImage"></div>
                        <div className="dateUploaded">{item.dateUploaded}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
