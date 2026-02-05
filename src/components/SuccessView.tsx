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

  const correctAnswer = quiz.a * quiz.b;

  const checkAnswer = () => {
    if (Number(userAnswer) === correctAnswer) {
      setIsCorrect(true);
    } else {
      alert('おしい！もういちど かぞえてみよう！');
    }
  };

  return (
    <div className="view-container" style={{ textAlign: 'center', padding: '20px' }}>
      {!isCorrect ? (
        // === まだ正解していない時：問題表示 ===
        <>
          <h2>さいごの 確認（かくにん）！</h2>
          <p>ぜんぶで いくつになったかな？</p>
          
          {/* 完成したアレイ図を表示 */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '10px', 
            margin: '20px auto',
            opacity: 0.8 // 少し控えめに表示
          }}>
            {Array.from({ length: quiz.b }).map((_, i) => (
              <Basket key={i} unit={quiz.a} count={quiz.a} isComplete={true} />
            ))}
          </div>

          <div style={{ fontSize: '1.5rem', margin: '20px' }}>
            {quiz.a} × {quiz.b} = 
            <input 
              type="number" 
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              style={{ 
                fontSize: '1.5rem', 
                width: '80px', 
                marginLeft: '10px',
                textAlign: 'center',
                padding: '5px'
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
              cursor: 'pointer'
            }}
          >
            こたえあわせ
          </button>
        </>
      ) : (
        // === 正解した時：はなまる表示 ===
        <div style={{ animation: 'popIn 0.5s' }}>
          <h1 style={{ color: '#e74c3c', fontSize: '3rem', marginBottom: '10px' }}>
            たいへんよくできました！
          </h1>
          
          {/* CSSで「はなまる」を描くのは大変なので、絵文字で代用！ */}
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
    </div>
  );
}