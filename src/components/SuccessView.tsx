import { useState } from 'react';
import type { Quiz } from '../types';
import { Basket } from './Basket';

interface Props {
  quiz: Quiz;
  onReset: () => void;
}

export function SuccessView({ quiz, onReset }: Props) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  
  // エラー状態を管理するフラグ
  const [isError, setIsError] = useState(false);

  const correctAnswer = quiz.a;

  const checkAnswer = () => {
    // 入力が空なら何もしない
    if (!userAnswer) return;

    if (Number(userAnswer) === correctAnswer) {
      setIsCorrect(true);
      setIsError(false); // エラー解除
    } else {
      // alertではなく、Stateを更新して画面表示を変える
      setIsError(true);
    }
  };

  // 再入力しようとしたらエラー表示を消してあげる（優しいUX）
  const handleInputChange = (val: string) => {
    setUserAnswer(val);
    if (isError) setIsError(false);
  };

  return (
    <div className="view-container" style={{ textAlign: 'center', padding: '20px' }}>
      {!isCorrect ? (
        // === まだ正解していない時 ===
        <>
          <h2>さいごの 確認（かくにん）！</h2>
          <p>「？」にはいる数はいくつかな？</p>
          
          {/* エラー時にはメッセージを赤文字で出す */}
          {isError && (
            <p style={{ color: '#e74c3c', fontWeight: 'bold', animation: 'shake 0.3s' }}>
              おしい！ボールはいくつふやしたかな？ かぞえてみよう！
            </p>
          )}

          {/* === アレイ図の表示エリア === */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: '20px', 
            margin: '30px auto',
            flexWrap: 'wrap'
          }}>
            
            {/* グループ1: 最初から入っていた箱たち (quiz.c 個) */}
            <div style={{
              display: 'flex',
              gap: '10px',
              padding: '10px',
              borderRadius: '12px',
              // エラー時だけ、青い点線で囲って「もともとあった」感を出す
              border: isError ? '3px dashed #3498db' : '3px solid transparent',
              background: isError ? '#ebf5fb' : 'transparent',
              transition: 'all 0.5s ease',
              position: 'relative'
            }}>
              {/* エラー時にラベルを出す */}
              {isError && (
                <span style={{
                  position: 'absolute', top: '-25px', left: '0', 
                  color: '#3498db', fontSize: '0.9rem', fontWeight: 'bold'
                }}>
                  さいしょにあった ({quiz.a}×{quiz.c})
                </span>
              )}
              
              {Array.from({ length: quiz.c }).map((_, i) => (
                <Basket key={i} unit={quiz.a} count={quiz.a} isComplete={true} />
              ))}
            </div>

            {/* グループ2: 新しく追加した箱 (残り全部、基本は1個) */}
            <div style={{
              display: 'flex',
              gap: '10px',
              padding: '10px',
              borderRadius: '12px',
              // エラー時だけ、赤く強調して「ふえたぶん」感を出す
              border: isError ? '3px solid #e74c3c' : '3px solid transparent',
              background: isError ? '#fadbd8' : 'transparent',
              boxShadow: isError ? '0 0 15px rgba(231, 76, 60, 0.4)' : 'none',
              transform: isError ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.5s ease',
              position: 'relative'
            }}>
              {isError && (
                <span style={{
                  position: 'absolute', top: '-25px', left: '0', width: '100%',
                  color: '#e74c3c', fontSize: '0.9rem', fontWeight: 'bold'
                }}>
                  ふえたぶん
                </span>
              )}

              {Array.from({ length: quiz.b - quiz.c }).map((_, i) => (
                <Basket key={i} unit={quiz.a} count={quiz.a} isComplete={true} />
              ))}
            </div>

          </div>

          {/* 数式と入力欄 */}
          <div style={{ fontSize: '1.5rem', margin: '20px' }}>
            {quiz.a} × {quiz.c} = {quiz.a} × {quiz.b} +
            <input 
              type="number" 
              value={userAnswer}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()} // Enterキーでも送信
              style={{ 
                fontSize: '1.5rem', 
                width: '80px', 
                marginLeft: '10px',
                textAlign: 'center',
                padding: '5px',
                border: isError ? '2px solid #e74c3c' : '1px solid #ccc',
                borderRadius: '4px',
                outline: 'none',
                background: isError ? '#fff5f5' : 'white'
              }}
              placeholder="?"
            />
          </div>

          <button 
            onClick={checkAnswer}
            style={{
              background: '#e67e22',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 30px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              // エラー時は少しボタンを揺らすアニメーションなどを入れても面白い
            }}
          >
            こたえあわせ
          </button>
        </>
      ) : (
        // === 正解した時の表示（そのまま） ===
        <div style={{ animation: 'popIn 0.5s' }}>
          <h1 style={{ color: '#e74c3c', fontSize: '3rem', marginBottom: '10px' }}>
            たいへんよくできました！
          </h1>
          <div style={{ fontSize: '10rem' }}>💮</div>
          <p style={{ fontSize: '1.5rem' }}>
            こたえは <strong>{correctAnswer}</strong> でした！
          </p>
          <button 
            onClick={onReset}
            style={{
              marginTop: '30px',
              background: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              padding: '15px 40px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              boxShadow: '0 4px 0 #2980b9'
            }}
          >
            つぎの問題をつくる
          </button>
        </div>
      )}

      {/* 揺れるアニメーション用のスタイル定義 */}
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}