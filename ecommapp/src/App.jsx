import React, { useState } from 'react';
import { GripVertical, Pencil, Plus, X, ChevronUp } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './App.css';
import ProductPicker from './components/ProductPicker';

const SortableRow = ({ id, index, row, onOpenModal, onToggleDiscount, onRemoveRow, onUpdateDiscount, rowCount }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="row-item-container">
      <div className="row-main-controls">
        <div {...attributes} {...listeners} className="drag-icon-wrapper">
          <GripVertical size={20} color="#999" />
        </div>
        <span className="row-number-label">{index + 1}.</span>
        
        <div className="product-display-field" onClick={() => onOpenModal(index)}>
          <span className={row.product ? "text-black" : "text-placeholder"}>
            {row.product ? row.product.title : "Select Product"}
          </span>
          <Pencil size={16} className="pencil-icon" />
        </div>

        {!row.showDiscount ? (
          <button className="add-discount-green-btn" onClick={() => onToggleDiscount(index)}>
            Add Discount
          </button>
        ) : (
          <div className="discount-input-row">
            <input 
              type="number" 
              className="disc-val-input" 
              value={row.discountValue} 
              onChange={(e) => onUpdateDiscount(index, 'discountValue', e.target.value)}
            />
            <select 
              className="disc-type-select" 
              value={row.discountType}
              onChange={(e) => onUpdateDiscount(index, 'discountType', e.target.value)}
            >
              <option>% Off</option>
              <option>Flat Off</option>
            </select>
            {rowCount > 1 && <X className="remove-cross" size={20} onClick={() => onRemoveRow(id)} />}
          </div>
        )}
      </div>

      {row.product?.variants?.length > 0 && (
        <div className="variant-tags-container">
          {row.product.variants.map(v => (
            <div key={v.id} className="variant-chip-blue">{v.title}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [rows, setRows] = useState([{ id: 'row-1', product: null, showDiscount: false, discountValue: 0, discountType: '% Off' }]);
  const [modal, setModal] = useState({ isOpen: false, rowIndex: null });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setRows((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addRow = () => {
    if (rows.length < 4) {
      setRows([...rows, { id: `row-${Date.now()}`, product: null, showDiscount: false, discountValue: 0, discountType: '% Off' }]);
    }
  };

  const updateDiscount = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  return (
    <div className="monk-app-wrapper">
      <header className="monk-top-header">
        <span className="monk-logo-text">video-reviews</span>
      </header>

      <main className="monk-main-body">
        <div className="monk-title-section">
          <h1>Offer Funnel</h1>
          <div className="monk-support-links">Support | Talk to an Expert</div>
        </div>

        <div className="monk-card">
          <h2 className="monk-card-title">Add Bundle Products (Max. 4 Products)</h2>
          <div className="monk-info-banner">
            <span className="monk-info-icon">i</span>
            <p>Offer Bundle will be shown to the customer whenever any of the bundle products are added to the cart.</p>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={rows.map(r => r.id)} strategy={verticalListSortingStrategy}>
              {rows.map((row, index) => (
                <SortableRow 
                  key={row.id} id={row.id} index={index} row={row} rowCount={rows.length}
                  onOpenModal={(idx) => setModal({ isOpen: true, rowIndex: idx })}
                  onToggleDiscount={(idx) => updateDiscount(idx, 'showDiscount', true)}
                  onRemoveRow={(id) => setRows(rows.filter(r => r.id !== id))}
                  onUpdateDiscount={updateDiscount}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button className="monk-add-product-outline" onClick={addRow}>Add Product</button>

          <div className="monk-compare-check">
            <input type="checkbox" id="compare-price" />
            <label htmlFor="compare-price">Apply discount on compare price. <span>?</span></label>
            <p className="check-hint">Discount will be applied on compare price of the product...</p>
          </div>

          <div className="monk-advanced-section">
            <div className="advanced-header">
              <span>Advanced offer customizations</span>
              <ChevronUp size={18} />
            </div>
            <div className="timer-check">
              <input type="checkbox" id="enable-timer" />
              <label htmlFor="enable-timer">Enable timer for this offer.</label>
            </div>
          </div>
        </div>
      </main>

      <ProductPicker 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ isOpen: false, rowIndex: null })}
        onSelect={(data) => {
          const newRows = [...rows];
          newRows[modal.rowIndex].product = data;
          setRows(newRows);
          setModal({ isOpen: false, rowIndex: null });
        }}
      />
    </div>
  );
}