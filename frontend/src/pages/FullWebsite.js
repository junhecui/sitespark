import React, { useState, useEffect } from 'react';
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

const FullWebsite = () => {
  const { websiteId } = useParams();
  const [pages, setPages] = useState([]);

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

  const renderWidget = (widget) => {
    let WidgetComponent;
    switch (widget.type) {
      case 'form':
        WidgetComponent = FormWidget;
        break;
      case 'chart':
        WidgetComponent = ChartWidget;
        break;
      case 'text':
        WidgetComponent = TextWidget;
        break;
      case 'image':
        WidgetComponent = ImageWidget;
        break;
      case 'button':
        WidgetComponent = ButtonWidget;
        break;
      case 'shape':
        WidgetComponent = ShapeWidget;
        break;
      default:
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
    </div>
  );

  return (
    <div className="full-website">
      {pages.map(renderPage)}
    </div>
  );
};

export default FullWebsite;