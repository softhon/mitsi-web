// export const useConfStore = create<ConfStoreState>()(
//   devtools(
//     persist(
//       immer((set, get, api) => ({
//         counter: {
//           ...createCounterSlice(set, get, api), // Spread the slice
//         },
//       })),
//       {
//         name: 'app-store',
//         partialize: state => ({
//           counter: {
//             count: state.counter.count, // Only persist the count
//           },
//         }), // Prevent serializing actions
//       }
//     ),
//     { name: 'app-store' }
//   )
// );
