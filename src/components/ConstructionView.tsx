import { useState, useEffect } from 'react';
import type { Quiz } from '../types';
import { Basket } from './Basket';

interface Props {
  quiz: Quiz;
  onFinish: () => void;
}

export function ConstructionView({ quiz, onFinish }: Props) {
  // 状態管理: 袋から出した「バラのボール」の数
  // C++: int currentBalls = 0;
  const [currentBalls, setCurrentBalls] = useState(0);

  // 状態管理: かごとして完成したかどうかのフラグ
  // C++: bool isPackaged = false;
  const [isPackaged, setIsPackaged] = useState(false);

  // 定数: 1かごあたりの数 (unit)
  const UNIT = quiz.a;

  // 副作用 (Effect): ボールが規定数に達したら、自動的に「かご」化する
  // イベントリスナーや割り込み処理のようなイメージです
  useEffect(() => {
    if (currentBalls >= UNIT) {
      // 演出のために少し待ってから「パッケージ化」状態にする
      const timer = setTimeout(() => {
        setIsPackaged(true);
      }, 600); // 0.6秒待機
      return () => clearTimeout(timer); // クリーンアップ
    }
  }, [currentBalls, UNIT]);

  // 魔法の袋をクリックした時の処理
  const handleAddBall = () => {
    if (currentBalls < UNIT) {
      setCurrentBalls(prev => prev + 1);
    }
  };

  return (
    <div className="view-container" style={{ textAlign: 'center', padding: '10px' }}>
      <h2>つくる</h2>
      
      {/* 指示文 */}
      <p style={{ minHeight: '1.5em' }}>
        {isPackaged 
          ? <span style={{color: '#e67e22', fontWeight: 'bold'}}>完成！かごになったね！</span>
          : `魔法の袋をタップして、あと ${UNIT - currentBalls}こ ボールを出そう！`
        }
      </p>

      {/* メインの描画エリア */}
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '15px',
        margin: '20px auto',
        maxWidth: '100%'
      }}>
        {/* 1. すでに存在している「既知のかご」たち (quiz.c 個) */}
        {Array.from({ length: quiz.c }).map((_, i) => (
          <div key={i} style={{ opacity: 0.6 }}> {/* 既存のものは少し薄くして区別 */}
            <Basket unit={UNIT} count={UNIT} isComplete={true} />
          </div>
        ))}

        {/* 2. 今まさに作っている「作業中のかご」 */}
        {/* ここが Enactive (操作) の対象です */}
        <div style={{ 
          transform: isPackaged ? 'scale(1.1)' : 'scale(1)', 
          transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
        }}>
          <Basket 
            unit={UNIT} 
            count={currentBalls} 
            isComplete={isPackaged} 
          />
        </div>
      </div>

      {/* 数式 (Symbolic) のリアルタイム表示 */}
      <div style={{ 
        background: '#fff', 
        padding: '15px', 
        borderRadius: '8px', 
        margin: '20px auto',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        fontSize: '30px',
        fontFamily: 'monospace',
        maxWidth: '90%'
      }}>
        {quiz.a} × {quiz.b}
        
        {/* バラの数があるときは「+数」、完成したら式変形 */}
        {!isPackaged ? (
           <span style={{ color: currentBalls > 0 ? '#ff6b6b' : '#fff' }}>
             {` + ${currentBalls}`}
           </span>
        ) : (
          <span style={{ color: '#e67e22', fontWeight: 'bold', marginLeft: '10px',fontSize: '30px'}}>
             = {quiz.a} × {quiz.c}  + {(quiz.b - quiz.c) * quiz.a} 
          </span>
        )}
      </div>

      {/* 操作エリア */}
      <div style={{ marginTop: '30px', height: '80px' }}>
        {!isPackaged ? (
          // 魔法の袋ボタン
          <button 
            onClick={handleAddBall}
            style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              padding: '15px 30px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #2980b9',
              transition: 'transform 0.1s'
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'translateY(4px)'}
            onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            💰 魔法の袋
          </button>
        ) : (
          // 完成後の次へボタン
          <button 
            onClick={onFinish}
            style={{
              background: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '15px 40px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              animation: 'fadeIn 0.5s'
            }}
          >
            できた！次へ進む
          </button>
        )}
      </div>
    </div>
  );
}