// 多分お決まりのやつ。
import { useState } from 'react'
import './App.css'

//
function App() {
  // --- State (状態) 定義 ---
  // C++でいうところのメンバ変数ですが、Reactでは「値が変わったら自動再描画」される特殊な変数です。
  //usestateについて。これは変数の値とその値を安全に書き換えるための関数ポインタ。
  //
  const [unitValue, setUnitValue] = useState(2); // 1あたり量 (例: 2個ずつ)
  const [quantity, setQuantity] = useState(3);  // いくつ分 (例: 3皿)

  // 合計を計算（これはStateから導出できるので、ただの定数でOK）
  const total = unitValue * quantity;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Copic Builder (MVP)</h1>
      
      {/* --- Symbolic (抽象・数値) の操作エリア --- */}
      <section style={{ marginBottom: '20px' }}>
        <label> 1あたり量： 
          <input 
            type="number" 
            value={unitValue} 
            onChange={(e) => setUnitValue(Number(e.target.value))} 
          />
        </label>
        <br />
        <label> いくつ分： 
          <input 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))} 
          />
        </label>
        <h2>式： {unitValue} × {quantity} = {total}</h2>
      </section>

      <hr />

      {/* --- Iconic (視覚・図形) の表示エリア --- */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* quantity（いくつ分）の数だけ、グループを作る */}
        {Array.from({ length: quantity }).map((_, gIndex) => (
          <div key={gIndex} style={{ 
            border: '2px solid #ccc', 
            padding: '10px', 
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            {/* unitValue（1あたり量）の数だけ、ドットを描画する */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
              {Array.from({ length: unitValue }).map((_, dIndex) => (
                <div key={dIndex} style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: '#ff6b6b', 
                  borderRadius: '50%' 
                }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
