import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import './picker.css';
// import { API_KEY } from '../utilities/constant';

const ProductModal = ({ isOpen, onClose, onSelect }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({}); 

  const fetchProducts = useCallback(async (isInitial = false) => {
    if (loading) return;
    setLoading(true);
    
    const targetPage = isInitial ? 0 : page;
    const API_KEY = import.meta.env.VITE_MONK_API_KEY;

    try {
      const response = await fetch(
        `https://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${targetPage}&limit=10`,
        { headers: { "x-api-key": API_KEY } }
      );
      const data = await response.json();
      
      setProducts(prev => isInitial ? data : [...prev, ...data]);
      setPage(targetPage + 1);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [search, page, loading]);

  useEffect(() => {
    if (isOpen) fetchProducts(true);
  }, [isOpen, search]);

  const handleSelect = () => {
    const firstId = Object.keys(selected).find(id => selected[id]?.length > 0);
    if (firstId) {
      const p = products.find(prod => prod.id === parseInt(firstId));
      onSelect({ ...p, variants: p.variants.filter(v => selected[p.id].includes(v.id)) });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="monk-modal-overlay">
      <div className="monk-modal-container">
        <div className="m-header">
          <h3>Select Products</h3>
          <X onClick={onClose} className="pointer" />
        </div>
        <div className="m-search">
          <Search className="s-icon" size={16} />
          <input 
            placeholder="Search product" 
            onChange={e => { setSearch(e.target.value); setPage(0); }} 
          />
        </div>
        <div className="m-body">
          {products.map(p => (
            <div key={p.id} className="p-row">
              <input 
                type="checkbox" 
                onChange={() => setSelected({...selected, [p.id]: p.variants.map(v => v.id)})} 
              />
              <img src={p.image?.src} alt="" className="m-thumb" />
              <span>{p.title}</span>
            </div>
          ))}
          <button className="m-load" onClick={() => fetchProducts(false)}>
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
        <div className="m-footer">
          <button className="m-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="m-btn-add" onClick={handleSelect}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;