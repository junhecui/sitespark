import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import FormWidget from '../components/widgets/FormWidget';
import ChartWidget from '../components/widgets/ChartWidget';
import TextWidget from '../components/widgets/TextWidget';
import ImageWidget from '../components/widgets/ImageWidget';
import ButtonWidget from '../components/widgets/ButtonWidget';
import ShapeWidget from '../components/widgets/ShapeWidget';
import '../index.css';

const widgetComponents = {
  form: FormWidget,
  chart: ChartWidget,
  text: TextWidget,
  image: ImageWidget,
  button: ButtonWidget,
  shape: ShapeWidget,
};

const FullWebsite = () => {
  const { websiteId } = useParams();
  const [pages, setPages] = useState([]);
  const [compiledUrl, setCompiledUrl] = useState('');
  const [homePageId, setHomePageId] = useState('');

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/website/${websiteId}/full`);
        setPages(response.data);
      } catch (error) {
        console.error('Error fetching full website data:', error);
      }
    };

    fetchPages();
  }, [websiteId]);

  const compileWebsite = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/compile', {
        websiteId,
        homePageId
      });
      setCompiledUrl(response.data.compiledUrl);
    } catch (error) {
      console.error('Error compiling website:', error);
    }
  };

  const renderWidget = (widget) => {
    const WidgetComponent = widgetComponents[widget.type];
    if (!WidgetComponent) {
      console.error(`Widget type "${widget.type}" not recognized.`);
      return null;
    }
    return (
      <Rnd
        key={widget.id}
        bounds="parent"
        size={{ width: widget.size.width, height: widget.size.height }}
        position={{ x: widget.position.x, y: widget.position.y }}
        disableDragging={true}
        enableResizing={false}
        className="widget-container"
      >
        <div className="widget-content">
          <WidgetComponent data={widget.data} id={widget.id} />
        </div>
      </Rnd>
    );
  };

  const renderPage = (page) => (
    <div key={page.id} className="page-container">
      <h2 className="text-2xl font-bold mb-4">{page.name}</h2>
      <div className="boundary-box" style={{ width: '1200px', height: '800px', border: '2px solid black', position: 'relative', overflow: 'hidden' }}>
        {page.widgets.map(renderWidget)}
      </div>
      <button onClick={() => setHomePageId(page.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Set as Home Page
      </button>
    </div>
  );

  return (
    <div className="full-website">
      <h1 className="text-2xl font-bold mb-4">Full Website</h1>
      {pages.map(renderPage)}
      <button onClick={compileWebsite} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
        Compile Website
      </button>
      {compiledUrl && (
        <div>
          <p>Website compiled successfully!</p>
          <a href={compiledUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            View Compiled Website
          </a>
        </div>
      )}
    </div>
  );
};

export default FullWebsite;