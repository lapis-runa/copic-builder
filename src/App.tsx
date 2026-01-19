import { useState } from 'react'
import './App.css'

// --- 型定義はそのまま ---
interface Copic { id: number; color: string; x: number; y: number; isGrouped: boolean; boxId: number | null; }

// 1. キャンバス部分を別の関数（部品）として切り出す
function CopicCanvas({ unit, count }: { unit: number, count: number }) {
  const total = unit * count;
  const colors = ['#FF7E79', '#FFD479', '#76D6FF', '#73FA79', '#D4A3FF'];

  // useStateの初期値としてランダム配置を作る（useEffectは不要！）
  const [copics, setCopics] = useState<Copic[]>(() => 
    Array.from({ length: total }).map((_, i) => ({
      id: i,
      color: colors[i % colors.length],
      x: Math.random() * 500 + 50,
      y: Math.random() * 100 + 300, // 下の方にばらまく
      isGrouped: false,
      boxId: null
    }))
  );

  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);

  // 数式の計算（Symbolic）
  const groupedTotal = copics.filter(c => c.isGrouped).length;
  const fullBoxes = Math.floor(groupedTotal / unit);
  const remainder = total - (fullBoxes * unit);

  // 1箱の中での整列ロジック (Iconic)
  const getPositionInBox = (boxId: number, indexInBox: number) => {
    const boxX = 20 + (boxId * 110);
    const row = Math.floor(indexInBox / 2);
    const col = indexInBox % 2;
    return { x: boxX + 25 + (col * 30), y: 70 + (row * 30) };
  };

  const handleCopicClick = (id: number) => {
    if (selectedBoxId === null) return;
    setCopics(prev => {
      const inBox = prev.filter(c => c.boxId === selectedBoxId).length;
      if (inBox >= unit) return prev; // 箱がいっぱいなら何もしない

      return prev.map(c => {
        if (c.id === id && !c.isGrouped) {
          const pos = getPositionInBox(selectedBoxId, inBox);
          return { ...c, isGrouped: true, boxId: selectedBoxId, x: pos.x, y: pos.y };
        }
        return c;
      });
    });
  };

  return (
    <>
      <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
        {unit} × {count} = {unit} × {fullBoxes} + {remainder}
      </div>

      <div className="canvas" style={{ position: 'relative', height: '500px', border: '2px solid #333', background: '#fff' }}>
        {/* 箱の表示 */}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} onClick={() => setSelectedBoxId(i)}
            style={{
              position: 'absolute', left: 20 + (i * 110), top: 40,
              width: '90px', height: '120px',
              border: `4px solid ${selectedBoxId === i ? '#FF9500' : '#ddd'}`,
              borderRadius: '8px'
            }}>箱 {i + 1}</div>
        ))}

        {/* コピックの表示 */}
        {copics.map(c => (
          <div key={c.id} onClick={() => handleCopicClick(c.id)}
            style={{
              position: 'absolute', left: c.x, top: c.y,
              width: '24px', height: '24px', borderRadius: '50%',
              backgroundColor: c.isGrouped ? c.color : '#666',
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer', zIndex: c.isGrouped ? 1 : 10
            }} />
        ))}
      </div>
    </>
  );
}

// 2. メインの App コンポーネント
export default function App() {
  const [unit, setUnit] = useState(4);
  const [count, setCount] = useState(6);

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h2>Copic Builder</h2>
      <div style={{ marginBottom: '20px' }}>
        <input type="number" value={unit} onChange={e => setUnit(Number(e.target.value))} />
        <span> × </span>
        <input type="number" value={count} onChange={e => setCount(Number(e.target.value))} />
      </div>

      {/* ここがポイント！ 
        key に [unit, count] を指定することで、値が変わるたびに 
        CopicCanvas が「新品」に作り直され、Stateが自動でリセットされます。
      */}
      <CopicCanvas key={`${unit}-${count}`} unit={unit} count={count} />
    </div>
  );
}