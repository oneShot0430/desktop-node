// import React, { useReducer } from 'react';

// import { Button } from 'webapp/ui/Button';

// export type PropsType = {
//   taskName: string;
//   taskCreator: string;
//   earnedKoiiAmount: number;
//   stakedTokensAmount: number;
// };

// const initialState = { show: 'selectAction' };

// function reducer(
//   state: { show: 'withdraw' | 'stake' | 'selectAction' },
//   action
// ) {
//   switch (action.type) {
//     case 'withdraw':
//       return { show: 'withdraw' };
//     case 'stake':
//       return { show: 'stake' };
//     default:
//       return { show: 'selectAction' };
//   }
// }

// export const ModalContent = ({
//   taskName,
//   taskCreator,
//   earnedKoiiAmount,
//   stakedTokensAmount,
// }: PropsType) => {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   if (state.show === 'withdraw') {
//     return <div>Withdraw</div>;
//   }

//   if (state.show === 'stake') {
//     return <div>Stake</div>;
//   }

//   return (
//     <div className="flex flex-col justify-center pt-10 text-finnieBlue-dark">
//       <div className="mb-[28px] text-lg">
//         <div className="font-semibold">{taskName}</div>
//         <div>{taskCreator}</div>
//       </div>

//       <div className="flex flex-col justify-center mb-[40px] text-base">
//         <p>
//           {`You’ve earned ${earnedKoiiAmount} KOII by staking ${stakedTokensAmount} tokens on this task.`}
//         </p>
//         <p>You can withdraw your stake or add more now.</p>
//       </div>

//       <div className="flex justify-center gap-[60px] ">
//         <Button
//           onClick={() => dispatch({ show: 'stake' })}
//           label="Withdraw Stake"
//           variant="danger"
//         />
//         <Button
//           onClick={() => dispatch({ show: 'withdraw' })}
//           label="Add More Stake"
//         />
//       </div>
//     </div>
//   );
// };
