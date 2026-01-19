import { useState } from 'react'
import './App.css'

// --- 型定義はそのまま ---
interface Copic { id: number; color: string; x: number; y: number; isGrouped: boolean; boxId: number | null; }

// 1. キャンバス部分を別の関数（部品）として切り出す
function CopicCanvas({ unit, count }: { unit: number, count: number }) {
  const total = unit * count;
  
  // 箱の数に合わせた色の配列を生成
  const generateColors = (n: number) => {
    return Array.from({ length: n }).map((_, i) => `hsl(${(i * 360) / n}, 70%, 60%)`);
  };
  const boxColors = generateColors(count);

  const [copics, setCopics] = useState<Copic[]>(() => 
    Array.from({ length: total }).map((_, i) => {
      // 整数除算でグループ（色）を決める: 0〜unit-1はグループ0, unit〜2*unit-1はグループ1...
      const groupIndex = Math.floor(i / unit);
      return {
        id: i,
        color: boxColors[groupIndex], // グループごとの色
        x: Math.random() * (count * 100) + 50,
        y: Math.random() * 100 + 300,
        isGrouped: false,
        boxId: null
      };
    })
  );

  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);

  // --- 操作ロジックの変更 ---
  const handleCopicClick = (id: number) => {
    setCopics(prev => prev.map(c => {
      if (c.id !== id) return c;

      // すでに箱に入っている場合 -> 外に出す
      if (c.isGrouped) {
        return { 
          ...c, 
          isGrouped: false, 
          boxId: null, 
          x: Math.random() * (count * 100) + 50, 
          y: Math.random() * 100 + 300 
        };
      }

      // 箱に入っていない場合 -> 選択中の箱に入れる
      if (selectedBoxId === null) {
        alert("まずは入れる箱を選んでね！");
        return c;
      }

      const inBox = prev.filter(copy => copy.boxId === selectedBoxId).length;
      if (inBox >= unit) {
        alert("この箱はいっぱいだよ！");
        return c;
      }

      const pos = getPositionInBox(selectedBoxId, inBox);
      return { ...c, isGrouped: true, boxId: selectedBoxId, x: pos.x, y: pos.y };
    }));
  };

  const getPositionInBox = (boxId: number, indexInBox: number) => {
    const boxX = 20 + (boxId * 110);
    const row = Math.floor(indexInBox / 2);
    const col = indexInBox % 2;
    return { x: boxX + 25 + (col * 30), y: 70 + (row * 30) };
  };

  // UIの再計算
  const fullBoxes = Math.floor(copics.filter(c => c.isGrouped).length / unit);
  const remainder = total - (fullBoxes * unit);

  return (
    <>
      <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
        {unit} × {count} = {unit} × {fullBoxes} + {remainder}
      </div>

      {/* キャンバスの横幅を動的に設定 */}
      <div className="canvas" style={{ 
        position: 'relative', 
        height: '500px', 
        width: `${Math.max(count * 110 + 40, 600)}px`, // 箱の数に応じて拡張
        border: '2px solid #333', 
        background: '#fff',
        overflowX: 'auto', // はみ出した場合はスクロール可能に
        margin: '0 auto'
      }}>
        {/* 箱の表示: 枠線の色をグループの色と合わせる */}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} onClick={() => setSelectedBoxId(i)}
            style={{
              position: 'absolute', left: 20 + (i * 110), top: 40,
              width: '90px', height: '120px',
              border: `4px solid ${selectedBoxId === i ? '#333' : boxColors[i]}`,
              borderRadius: '8px',
              backgroundColor: selectedBoxId === i ? '#f0f0f0' : 'transparent',
              transition: 'all 0.3s'
            }}>箱 {i + 1}</div>
        ))}

        {/* コピックの表示 */}
        {copics.map(c => (
          <div key={c.id} onClick={() => handleCopicClick(c.id)}
            style={{
              position: 'absolute', left: c.x, top: c.y,
              width: '24px', height: '24px', borderRadius: '50%',
              backgroundColor: c.isGrouped ? c.color : '#ccc', // 外にいるときはグレー
              border: `2px solid ${c.isGrouped ? 'white' : c.color}`, // 外にいるときは枠線だけ色をつける
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