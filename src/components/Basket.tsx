import '../App.css'; // スタイルは後で調整しますが、一旦import

interface Props {
  unit: number;        // 1かごあたりの定員（例：4）
  count: number;       // 今入っているボールの数
  isComplete?: boolean; // 満タンかどうか（オプション）
}

export function Basket({ unit, count, isComplete = false }: Props) {
  // CSS Gridを使ってボールを綺麗に並べます
  return (
    <div 
      className={`basket ${isComplete ? 'complete' : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', // 2列で折り返し
        gap: '5px',
        border: '3px solid #ccc',
        borderRadius: '10px',
        padding: '10px',
        width: '80px', // サイズは適宜調整
        backgroundColor: isComplete ? '#fff0f0' : 'white', // 完成したらほんのり赤く
        transition: 'all 0.3s ease'
      }}
    >
      {/* unitの数だけ枠を作り、countの数だけボールを表示 */}
      {Array.from({ length: unit }).map((_, i) => (
        <div 
          key={i} 
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: i < count ? '#ff6b6b' : '#eee', // あるなら赤、ないならグレー
            transform: i < count ? 'scale(1)' : 'scale(0.8)',
            transition: 'transform 0.2s'
          }}
        />
      ))}
    </div>
  );
}