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

const rainbowColors = ['#FF0000', '#FF7E00', '#FFFF00', '#008000', '#0000CC', '#4B0082', '#8B00E8']; // Typical rainbow colors

export default function MainPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [numItems, setNumItems] = useState(20);
    const [items, setItems] = useState(generateItems(numItems));
    const [currentColor, setCurrentColor] = useState(rainbowColors[0]); // Default color is red
    const sketchRef = useRef();
    const p5Instance = useRef(null);

    const Sketch = (p) => {
        let prevX = null;
        let prevY = null;

        p.setup = () => {
            p.createCanvas(300, 300);
            p.background(0);
        };

        p.draw = () => {
            console.log(currentColor)
            p.stroke(currentColor);
            p.strokeWeight(2);

            if (p.mouseIsPressed) {
                if (prevX !== null && prevY !== null) {
                    p.line(prevX, prevY, p.mouseX, p.mouseY);
                }
                prevX = p.mouseX;
                prevY = p.mouseY;
            } else {
                prevX = null;
                prevY = null;
            }
        };
    };

    useEffect(() => {
        if (isModalOpen) {
            p5Instance.current = new p5(Sketch, sketchRef.current);
        } else {
            if (p5Instance.current) {
                const canvas = p5Instance.current.canvas;
                const base64Image = canvas.toDataURL("image/png");
                console.log(base64Image);
                
                p5Instance.current.remove();
                p5Instance.current = null;
            }
        }

        return () => {
            if (p5Instance.current) {
                p5Instance.current.remove();
            }
        };
    }, [isModalOpen]);

    // Add this effect to update the sketch when the color changes
    useEffect(() => {
        if (p5Instance.current) {
            p5Instance.current.stroke(currentColor);
        }
    }, [currentColor]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleColorChange = (newColor) => () => {
        setCurrentColor(newColor);
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
              
              {/* Color buttons */}
              <div className="color-buttons">
                {rainbowColors.map(color => (
                  <button
                    key={color}
                    style={{
                      backgroundColor: color,
                      width: '30px',
                      height: '30px',
                      margin: '5px',
                      border: currentColor === color ? '2px solid black' : 'none'
                    }}
                    onClick={handleColorChange(color)}
                  />
                ))}
              </div>
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
