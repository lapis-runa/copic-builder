import type { Quiz } from '../types';

interface Props {
  quiz: Quiz;
  setQuiz: (q: Quiz) => void; 
  onStart: () => void;
}

export function SettingsView({ quiz, setQuiz, onStart }: Props) {

  // 数値を変更するためのヘルパー関数
  // 数値を変更するためのヘルパー関数
  // 「常に1桁モード」の実装
  const handleChange = (key: keyof Quiz, value: string) => {
    let num = 0;

    // ケース1: バックスペースで空になった場合 -> 0にする
    if (value === '') {
      num = 0;
    } 
    // ケース2: 何か入力された場合
    else {
      // 文字列の「一番最後に入力された文字」だけを取り出す
      // 例: 現在「0」で「3」と打つと valueは "03" -> 最後の "3" を採用
      // 例: 現在「4」で「5」と打つと valueは "45" -> 最後の "5" を採用 (上書き感覚)
      const lastChar = value.slice(-1);
      
      // それを数値にする
      num = Number(lastChar);
    }

    // 安全策: NaNなら0、念のため0-9に収める
    if (isNaN(num)) num = 0;
    
    // 九九なので一桁(0-9)で十分！
    // これにより "10" 以上の入力は物理的に不可能になります
    if (num > 9) num = 9; 
    if (num < 0) num = 0;

    // 3. Stateを更新
    // ここで num は必ず 0〜10 の整数になっています
    // "01" という文字列が来ても Number("01") で 1 になるので、
    // 次の再描画で「01」は消えて「1」になります。
    setQuiz({
      ...quiz,
      [key]: num
    });
  };

  // UX向上: フォーカスした瞬間に数字を全選択する関数
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="view-container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>もんだいの せってい</h2>
      <p>すきな数字を入れてね（10までだよ）</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '30px 0' }}>
        
        {/* === a (1かごの数) の設定 === */}
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            1かごに 何個？
          </label>
          <input 
            type="number" 
            value={quiz.a} 
            onChange={(e) => handleChange('a', e.target.value)}
            onFocus={handleFocus} // ← これを追加！クリックするとパッと全選択されます
            min={0} // ブラウザのUI（矢印操作）用の制限
            max={10}
            style={{ padding: '10px', fontSize: '1.2rem', width: '100%' }}
          />
        </div>

        {/* === c (最初のかご数) の設定 === */}
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            最初は かご何個から？
          </label>
          <input 
            type="number" 
            value={quiz.c} 
            onChange={(e) => handleChange('c', e.target.value)}
            onFocus={handleFocus} // ← これを追加
            min={0}
            max={10}
            style={{ padding: '10px', fontSize: '1.2rem', width: '100%' }}
          />
        </div>

        {/* === b (目標のかご数) の設定 === */}
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            全部で かご何個にする？
          </label>
          <input 
            type="number" 
            value={quiz.b} 
            onChange={(e) => handleChange('b', e.target.value)}
            onFocus={handleFocus} // ← これを追加
            min={0}
            max={10}
            style={{ padding: '10px', fontSize: '1.2rem', width: '100%' }}
          />
        </div>

      </div>

      {/* プレビュー表示 */}
      <div style={{ 
        background: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        今の設定：<br/>
        {quiz.a} × {quiz.c} → {quiz.a} × {quiz.b} を目指す！
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
        この問題ではじめる！
      </button>
    </div>
  );
}