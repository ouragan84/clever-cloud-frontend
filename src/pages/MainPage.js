import React, { useState, useEffect, useRef } from 'react';
import '../styles/MainPageStyles.css';
import { FaPencilAlt, FaSearch } from 'react-icons/fa';
import p5 from 'p5';

import env from "react-dotenv";
import { IoDocumentSharp, IoDocumentText, IoImage, IoClose, IoArrowDownCircle, IoPencil } from "react-icons/io5";

import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


const BACKEND_URL = env.BACKEND_URL;

const fileTypes = ['pdf', 'doc', 'docx', 'txt', 'jpeg', 'gif', 'png'];

const generateItems = (count) => {
  let items = [];
  //5q1dy6u6omgnlq3kvxvfv4llz0vtvbtl
  items.push({
    id: 'gf4ivbey05ntgb2kyqe2g6j6ksewv5j4',
    title: 'gf4ivbey05ntgb2kyqe2g6j6ksewv5j4',
    extension: 'png',
    previewImage: null, // Placeholder for now
    dateUploaded: new Date().toLocaleDateString(),
    dateModified: new Date().toLocaleDateString(),
    userCreated: 'user1',
    pca_vector: [0.1, 0.2, 0.3],
    score: 0

    });

  //   items.push({
  //     id: '5q1dy6u6omgnlq3kvxvfv4llz0vtvbtl',
  //     title: '5q1dy6u6omgnlq3kvxvfv4llz0vtvbtl',
  //     extension: 'pdf',
  //     previewImage: null, // Placeholder for now
  //     dateUploaded: new Date().toLocaleDateString()
  //     });

  // for (let i = 0; i < count; i++) {
  //   let ext = fileTypes[Math.floor(Math.random() * fileTypes.length)];
  //   items.push({
  //     id: i,
  //     title: `File ${i}.${ext}`,
  //     extension: ext,
  //     previewImage: null, // Placeholder for now
  //     dateUploaded: new Date().toLocaleDateString()
  //   });
  // }
  return items;
};

export default function MainPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [numItems, setNumItems] = useState(20); // Default number of items
    const [items, setItems] = useState(generateItems(numItems));
    const sketchRef = useRef();
    const p5Instance = useRef(null);

    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [imgModalOpen, setImgModalOpen] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
      setNumPages(numPages);
    };
  
    const openFile = (file, file_extension) => {
      if (file_extension === 'jpeg' || file_extension === 'gif' || file_extension === 'png' || file_extension === 'jpg' || file_extension === 'gif') {
        console.log(file)
        setCurrentFile(file);
        setImgModalOpen(true);
      } else if (file_extension === 'pdf' || file_extension === 'txt') {
        setCurrentFile(file);
        setPdfModalOpen(true);
      }
    };



    const handleDownload = (url) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = 'DownloadedFile'; // You can add logic to name the file based on its content or metadata
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    useEffect(() => {
      const fetchItems = async () => {
        const response = await fetch(`${BACKEND_URL}/get-all`);
        const data = await response.json();
        console.log(data);
    
        const newItems = data.matches.map(match => {
          const item = match.metadata;
          const pca_vector = item.pca_representation.map(pca => parseFloat(pca));
    
          return {
            id: item.id,
            title: item.file_name,
            extension: item.extension,
            previewImage: null, // Placeholder for now
            dateUploaded: new Date(item.date_uploaded).toLocaleDateString(),
            dateModified: new Date(item.date_modified).toLocaleDateString(),
            userCreated: item.user_created,
            pca_vector: pca_vector,
            score: match.score
          };
        });
    
        setItems(newItems);
      };
    
      fetchItems();
    }, []);
    

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

    const getIconForFileType = (extension) => {
      const iconStyle = { color: 'grey', fontSize: '50px' }; // Default style
      switch(extension) {
        case 'pdf':
          return <IoDocumentSharp style={{ ...iconStyle, color: 'red' }} />;
        case 'doc':
        case 'docx':
          return <IoDocumentText style={{ ...iconStyle, color: 'blue' }} />;
        case 'jpeg':
        case 'jpg':
        case 'gif':
        case 'png':
          return <IoImage style={{ ...iconStyle, color: 'green' }} />;
        default:
          return <IoDocumentText style={iconStyle} />;
      }
    };
  

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

    // const uploadFile = async (file) => {
    //     const formData = new FormData();
    //     formData.append('file', file);

    //     try {
    //         const response = await fetch(`${BACKEND_URL}/upload-file`, {
    //             method: 'POST',
    //             body: formData,
    //         });

    //         if (response.ok) {
    //             const responseData = await response.json();
    //             console.log(responseData.message);
    //         } else {
    //             console.error('Failed to upload file');
    //             const errorResponse = await response.json();
    //             console.error(errorResponse.message);
    //         }
    //     } catch (error) {
    //         console.error('Failed to upload file', error);
    //     }
    // };
    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
    
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');
    
        try {
            const response = await fetch(`${BACKEND_URL}/upload-file`, {
                method: 'POST',
                headers: {
                    // Include the Authorization header with the token
                    'Authorization': `Bearer ${token}`
                },
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

    const handleVisualize = () => {
      console.log('Visualize action triggered');
    };

    function replaceEndpointInUrl(url, currentEndpoint, newEndpoint) {
        if (!url.includes(currentEndpoint)) {
            throw new Error(`URL does not contain the endpoint '${currentEndpoint}'.`);
        }
        return url.replace(currentEndpoint, newEndpoint);
    }
    

    const handleSummary = async (currentFile) => {
        try {
            console.log('file: ', currentFile)
            const response = await fetch(replaceEndpointInUrl(currentFile, "get-file", "summarize-pdf"));
            const data = await response.json();
            if (response.ok) {
                console.log('Summary:', data.summary);
                // Display the summary in the UI or alert for simplicity
                alert(data.summary);
            } else {
                throw new Error(data.message || 'Failed to fetch summary');
            }
        } catch (error) {
            console.error('Error fetching summary:', error);
            alert('Error fetching summary: ' + error.message);
        }
    };

    return (
      <div className="container">
        <button className="buttonTop uploadButton" onClick={() => chooseFile()}>Upload File</button>
        <button className="buttonTop visualizeButton" onClick={handleVisualize}>Visualize</button>

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
              <div ref={sketchRef}></div>
              <button onClick={() => setIsModalOpen(false)}>Search</button>
            </div>
          </div>
        )}
        {imgModalOpen && (
          <div className="imageModal">
            <div className="imageModalContent">
              <IoArrowDownCircle className="downloadIcon" onClick={() => handleDownload(currentFile)} />
              <IoClose className="closeIcon" onClick={() => setImgModalOpen(false)} />
              <img src={currentFile} alt="Document" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
          </div>
        )}
        {pdfModalOpen && (
          <div className="pdfModal">
            <div className="pdfModalContent">
              <IoPencil className="summaryIcon" onClick={() => handleSummary(currentFile)} />  
              <IoArrowDownCircle className="downloadIcon" onClick={() => handleDownload(currentFile)} />
              <IoClose className="closeIcon" onClick={() => setPdfModalOpen(false)} />
              <Document file={currentFile} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Page 
                    key={`page_${index + 1}`} 
                    pageNumber={index + 1} 
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />                
                  ))}
              </Document>
            </div>
          </div>
        )}
        <div className="grid">
          {items.map(item => (
            <div key={item.id} className="item">
              <a onClick={() => openFile(`${BACKEND_URL}/get-file?id=${item.id}`, item.extension)} className="title">{item.title}</a>
              <div className="previewImage">
                {getIconForFileType(item.extension)}
              </div>
              <div className="dateUploaded">{item.dateUploaded}</div>
            </div>
          ))}
        </div>
      </div>
    );
}