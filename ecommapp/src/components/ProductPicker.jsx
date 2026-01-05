import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { API_KEY } from '../utilities/constant';
import "../picker.css";

const ProductPicker = ({ isOpen, onClose, onSelect }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({}); 
  const [expanded, setExpanded] = useState({});
  const observer = useRef();

  const fetchProducts = useCallback(async (isInitial = false) => {
    if (loading) return;
    setLoading(true);
    const currentPage = isInitial ? 0 : page;
    
    try {
      const res = await fetch(
        `https://stageapi.monkcommerce.app/task/products/search?search=${search}&page=${currentPage}&limit=10`,
        { headers: { "x-api-key": API_KEY } }
      );
      const data = await res.json();
      
      setProducts(prev => isInitial ? data : [...prev, ...data]);
      setPage(currentPage + 1);
    } catch (err) {
      console.error("API Error", err);
    }
    setLoading(false);
  }, [search, page, loading]);


  useEffect(() => {
    if (isOpen) fetchProducts(true);
  }, [isOpen, search]);

  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchProducts(false);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, fetchProducts]);

  const handleProductCheck = (p) => {
    const isAll = selected[p.id]?.length === p.variants.length;
    setSelected({ ...selected, [p.id]: isAll ? [] : p.variants.map(v => v.id) });
  };

  const handleAdd = () => {
    const firstSelectedId = Object.keys(selected).find(id => selected[id]?.length > 0);
    if (firstSelectedId) {
      const p = products.find(prod => prod.id === parseInt(firstSelectedId));
      onSelect({ ...p, variants: p.variants.filter(v => selected[p.id].includes(v.id)) });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="monk-modal-overlay">
      <div className="monk-modal-container">
        <div className="monk-modal-header">
            <h3>Select Products</h3>
            <X onClick={onClose} className="monk-pointer" />
        </div>
        <div className="monk-modal-search">
          <Search className="monk-s-icon" size={16} />
          <input 
            placeholder="Search product" 
            autoFocus
            onChange={e => { setSearch(e.target.value); setPage(0); }} 
          />
        </div>
        <div className="monk-modal-body">
          {products.map((p, index) => (
            <div key={`${p.id}-${index}`} ref={index === products.length - 1 ? lastElementRef : null} className="monk-p-group">
              <div className="monk-p-row">
                <input type="checkbox" onChange={() => handleProductCheck(p)} checked={selected[p.id]?.length === p.variants.length} />
                <img src={p.image?.src || 'https://via.placeholder.com/40'} alt="" className="monk-thumb" />
                <span className="monk-p-name">{p.title}</span>
                <button className="monk-expand-btn" onClick={() => setExpanded({...expanded, [p.id]: !expanded[p.id]})}>
                  {expanded[p.id] ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              {expanded[p.id] && p.variants.map(v => (
                <div key={v.id} className="monk-v-row">
                  <input type="checkbox" checked={selected[p.id]?.includes(v.id)} onChange={() => {
                    const current = selected[p.id] || [];
                    setSelected({...selected, [p.id]: current.includes(v.id) ? current.filter(i => i !== v.id) : [...current, v.id]});
                  }} />
                  <span className="monk-v-name">{v.title}</span>
                  <span className="monk-v-price">${v.price}</span>
                </div>
              ))}
            </div>
          ))}
          {loading && <div className="monk-loading">Fetching items...</div>}
        </div>
        <div className="monk-modal-footer">
          <div className="selected-count">{Object.values(selected).flat().length} Selected</div>
          <div className="footer-btns">
            <button className="monk-btn-cancel" onClick={onClose}>Cancel</button>
            <button className="monk-btn-add" onClick={handleAdd}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;