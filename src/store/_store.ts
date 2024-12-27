import { configureStore } from '@reduxjs/toolkit';
import { fetchSlice } from './fetchSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    fetch: fetchSlice.reducer,
  },
});
// useDispatch は typeof store.dispatch の型を使用しています。
// これにより、Reduxストアの dispatch 関数の型が正確に推論され、
// アクションをディスパッチする際に適切な型チェックが行われます。
// これにより、タイポやアクションの誤用を防ぎ、コードの安全性を確保します。
export const useAddDispatch: () => typeof store.dispatch = useDispatch;
// useSelector は TypedUseSelectorHook<ReturnType<typeof store.getState>> の
// 型を使用しています。これにより、Reduxストアの状態に関する型情報が提供され、
// コンポーネント内で状態を選択する際に型安全性が確保されます。
// 正確な型情報が提供されることで、状態の型が一致しない場合に発生するエラーを回避できます。
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
