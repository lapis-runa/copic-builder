import { useState } from 'react'
import './App.css'

// --- 型定義 (Cの構造体) ---
interface Copic {
  id: number;
  color: string;
  x: number;
  y: number;
  isGrouped: boolean;
}

interface Box {
  id: number;
  color: string;
}

function App() {
  // --- 定数定義 ---
  const unit = 4;
  const count = 6;
  const totalCount = unit * count;

  // --- 状態(State)の定義 ---
  const [copics, setCopics] = useState<Copic[]>(() => {
    return Array.from({ length: totalCount }).map((_, i) => ({
      id: i,
      color: '#00bfa5',
      x: Math.random() * 400 + 50,
      y: Math.random() * 200 + 50,
      isGrouped: false,
    }));
  });

  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);

  // 箱のデータ
  const boxes: Box[] = Array.from({ length: count }).map((_, i) => ({
    id: i,
    color: '#e0e0e0',
  }));

  // --- 操作(Enactive)のロジック --- 
  const handleCopicClick = (id: number) => {
    if (selectedBoxId === null) {
      alert("まずは入れる箱を選んでね！");
      return;
    }

    setCopics(prevCopics => prevCopics.map(copic => {
      if (copic.id === id) {
        return { 
          ...copic, 
          isGrouped: true, 
          x: 20 + (selectedBoxId * 100), 
          y: 100 
        };
      }
      return copic;
    }));
  };

  // --- 写像 (UI) --- 
  return (
    <div className="container">
      <h1>Copic Builder</h1>
      <p className="formula">
        {unit} × {count} = {unit} × 5 + ?
      </p>

      <div className="canvas" style={{ position: 'relative', height: '400px', border: '1px solid #ccc', overflow: 'hidden' }}>
        
        {/* 箱の描画 (Iconic) */}
        <div className="boxes-layer">
          {boxes.map(box => (
            <div 
              key={box.id}
              onClick={() => setSelectedBoxId(box.id)}
              style={{
                width: '80px', 
                height: '80px', 
                border: `3px solid ${selectedBoxId === box.id ? 'orange' : '#ccc'}`,
                display: 'inline-block', 
                margin: '10px',
                cursor: 'pointer'
              }}
            >
              箱 {box.id + 1}
            </div>
          ))}
        </div>

        {/* コピックの描画 (Iconic) */}
        {copics.map(copic => (
          <div
            key={copic.id}
            onClick={() => handleCopicClick(copic.id)}
            style={{
              position: 'absolute',
              left: copic.x,
              top: copic.y,
              width: '24px',
              height: '24px',
              backgroundColor: copic.color,
              borderRadius: '50%',
              cursor: 'pointer',
              transition: 'all 0.5s ease-out', // シュッと動くアニメーション
              zIndex: 10
            }}
          />
        ))}
      </div>
    </div>
  );
} 

export default App;