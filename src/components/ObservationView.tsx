import type { Quiz } from '../types';
import { Basket } from './Basket'; // さっき作った部品をinclude!

interface Props {
  quiz: Quiz;
  onNext: () => void;
}

export function ObservationView({ quiz, onNext }: Props) {
  return (
    <div className="view-container" style={{ textAlign: 'center', padding: '20px' }}>
      <h2>{quiz.a} × {quiz.b} のかたち</h2>
      
      <p>1つのかごに {quiz.a}こ 入っています。</p>
      <p>それが {quiz.b}こ あります。</p>

      {/* かごをグリッド状に並べるエリア */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '20px', 
        margin: '30px 0' 
      }}>
        {Array.from({ length: quiz.b }).map((_, i) => (
          <Basket 
            key={i} 
            unit={quiz.a} 
            count={quiz.a} // 観察モードなので満タン
            isComplete={true} 
          />
        ))}
      </div>

      <button 
        onClick={onNext}
        style={{ padding: '10px 20px', fontSize: '1.2em' }}
      >
        わかった！つくる画面へ
      </button>
    </div>
  );
}