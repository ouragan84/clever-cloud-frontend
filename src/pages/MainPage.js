import React, { useState, useEffect, useRef } from 'react';
import '../styles/MainPageStyles.css';
import { FaPencilAlt, FaSearch, FaFile, FaFolder } from 'react-icons/fa';
import p5 from 'p5';

const generateItems = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        type: i % 2 === 0 ? 'file' : 'folder'
    }));
};

export default function MainPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [numItems, setNumItems] = useState(20); // Default number of items
    const [items, setItems] = useState(generateItems(numItems));
    const sketchRef = useRef();
    const p5Instance = useRef(null);

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
            // Draw color picker boxes
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
                    // Check if click is within the color picker area
                    const selectedColorIndex = Math.floor(p.mouseX / (p.width / colors.length));
                    currentColor = colors[selectedColorIndex];
                    lastX = -1; // Reset to avoid drawing lines from the color picker
                    lastY = -1;
                }
            } else {
                lastX = -1; // Reset on mouse release
                lastY = -1;
            }
        };

        p.mouseReleased = () => {
            // Reset last positions on mouse release to prevent continuous line drawing
            lastX = -1;
            lastY = -1;
        };
    };

    useEffect(() => {
        if (isModalOpen) {
            p5Instance.current = new p5(Sketch, sketchRef.current);
        } else {
            if (p5Instance.current) {
                // Console log the canvas as base64 when the modal is closed
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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
      <div className="container">
        <div className="searchBox">
          <FaSearch className="searchIcon leftIcon" />
          <input
            type="text"
            className="searchInput"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
          <FaPencilAlt className="searchIcon rightIcon" onClick={toggleModal} />
        </div>
        {isModalOpen && (
          <div className="modal">
            <div className="modalContent">
              <button onClick={toggleModal}>Close</button>
              <div ref={sketchRef}></div> {/* P5.js canvas will attach here */}
            </div>  
          </div>
        )}
        <div className="grid">
            {items.map(item => (
                <div key={item.id} className="item">
                    {item.type === 'file' ? <FaFile /> : <FaFolder />}
                </div>
            ))}
        </div>
      </div>
    );
}
