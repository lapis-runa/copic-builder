// export をつけることで、他のファイルから import 可能になります
export type Scene = 'SETTINGS' | 'OBSERVE' | 'CONSTRUCT' | 'SUCCESS';

export interface Quiz {
  a: number; // 1かごあたりの数
  b: number; // 目標のかごの数
  c: number; // 最初にあるかごの数
}