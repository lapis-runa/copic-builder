import { useState } from 'react';
import './App.css';
import  type { Scene, Quiz } from './types'; // 型定義を読み込み
import { ConstructionView } from './components/ConstructionView';
import { SettingsView } from './components/SettingsView';
import { ObservationView } from './components/ObservationView';
import { SuccessView } from './components/SuccessView';


export default function App() {
  // アプリ全体の状態管理
  const [scene, setScene] = useState<Scene>('SETTINGS');
  
  // デフォルト値: 4個入り × 6グループ (最初は5グループからスタート)
  const [quiz, setQuiz] = useState<Quiz>({ a: 4, b: 6, c: 5 });

  // シーン分岐ロジック (Switching Logic)
  const renderScene = () => {
    switch (scene) {
      case 'SETTINGS':
        return <SettingsView 
                 quiz={quiz} 
                 setQuiz={setQuiz} 
                 onStart={() => setScene('OBSERVE')} 
               />;
      case 'OBSERVE':
        return <ObservationView 
                 quiz={quiz} 
                 onNext={() => setScene('CONSTRUCT')} 
               />;
      case 'CONSTRUCT':
        return <ConstructionView 
                  quiz={quiz} 
                  onFinish={() => setScene('SUCCESS')} 
                />;
      case 'SUCCESS':
        return <SuccessView 
           quiz={quiz} 
           onReset={() => setScene('SETTINGS')} 
         />;         
      default:
        return <div>Unknown Scene</div>;
    }
  };

  return (
    <div className="app-container">
      {/* 簡易メニューバー */}
      <nav style={{ 
        padding: '10px', 
        background: '#eee', 
        display: 'flex', 
        gap: '10px',
        justifyContent: 'center'
      }}>
        <button onClick={() => setScene('SETTINGS')} disabled={scene === 'SETTINGS'}>設定</button> 
        <span>→</span>
        <button onClick={() => setScene('OBSERVE')} disabled={scene === 'OBSERVE'}>みる</button>
        <span>→</span>
        <button onClick={() => setScene('CONSTRUCT')} disabled={scene === 'CONSTRUCT'}>つくる</button>
        </nav>
      
      {/* メイン画面描画 */}
      <main>
        {renderScene()}
      </main>
    </div>
  );
}