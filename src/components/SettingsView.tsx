import type { Quiz } from '../types';

interface Props {
  quiz: Quiz;
  setQuiz: (q: Quiz) => void; 
  onStart: () => void;
}

export function SettingsView({ quiz, setQuiz, onStart }: Props) {

  const handleChange = (key: keyof Quiz, value: string) => {
    let num = 0;
    if (value === '') {
      num = 0;
    } else {
      const lastChar = value.slice(-1);
      num = Number(lastChar);
    }

    if (isNaN(num)) num = 0;
    if (num > 9) num = 9; 
    if (num < 0) num = 0;

    // 新しい設定を作成
    const newQuiz = { ...quiz, [key]: num };

    // c (最初の数) が変わったら、b (目標) は自動的に c + 1 にする
    if (key === 'c') {
      // ただし b が 9 を超えないように制限（九九の範囲内）
      newQuiz.b = Math.min(num + 1, 9);
    }
    // a (1かごの数) が変わった場合は、b, c はそのまま
    
    setQuiz(newQuiz);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="view-container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>もんだいの せってい</h2>
      <p>九九の学習：1つ増えるとどうなる？</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '30px 0' }}>
        
        {/* === a (1かごの数) === */}
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            1かごに 何個？ 
          </label>
          <input 
            type="number" 
            value={quiz.a} 
            onChange={(e) => handleChange('a', e.target.value)}
            onFocus={handleFocus}
            min={1} max={9}
            style={{ padding: '10px', fontSize: '1.2rem', width: '100%' }}
          />
        </div>

        {/* === c (最初のかご数) === */}
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            最初は かご何個から？ 
          </label>
          <input 
            type="number" 
            value={quiz.c} 
            onChange={(e) => handleChange('c', e.target.value)}
            onFocus={handleFocus}
            min={1} max={8} // +1するので最大は8までにしておく
            style={{ padding: '10px', fontSize: '1.2rem', width: '100%' }}
          />
        </div>

        {/* === b (目標) は自動計算なので入力不可にする === */}
        <div className="input-group" style={{ opacity: 0.7 }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#666' }}>
            目標のかごの数
          </label>
          <div style={{ 
            padding: '10px', 
            fontSize: '1.2rem', 
            background: '#eee', 
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}>
            <strong>{quiz.c + 1}</strong> 個
          </div>
        </div>

      </div>

      <div style={{ 
        background: '#fff3cd', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: 'bold',
        border: '2px solid #ffeeba'
      }}>
        今回のミッション：<br/>
        {quiz.a} × {quiz.c} に<br/>
        いくつかボールをたして<br/>
        <span style={{ fontSize: '1.2em', color: '#d35400' }}>
          {quiz.a} × {quiz.c + 1}
        </span> を作ろう！
      </div>

      <button 
        onClick={onStart}
        style={{
          background: '#3498db',
          color: 'white',
          border: 'none',
          padding: '15px 40px',
          fontSize: '1.2rem',
          borderRadius: '50px',
          cursor: 'pointer',
          width: '100%',
          boxShadow: '0 4px 0 #2980b9'
        }}
      >
        スタート！
      </button>
    </div>
  );
}