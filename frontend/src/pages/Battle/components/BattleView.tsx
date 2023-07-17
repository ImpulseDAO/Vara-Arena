// export const BattleView = () => {

//   return <div className="battle">
//   <div className="battle_users">
//     <div className="battle_user1">
//       <div className="battle_data">
//         <div className="battle_user">
//           <div className="battle_name">
//             <p>{user1?.name}</p>
//             <p>
//               <span>Level</span>
//               <span>1</span>
//             </p>
//           </div>
//         </div>
//         <div className="battle_armour">
//           <span>Armour</span>
//           <span>0</span>
//         </div>
//         <div className="battle_stats">
//           <p>
//             <span>Strength</span>
//             <span>{user1?.attributes.strength}</span>
//           </p>

//           <p>
//             <span>Agility</span>
//             <span>{user1?.attributes.agility}</span>
//           </p>
//           <p>
//             <span>Vitality</span>
//             <span>{user1?.attributes.vitality}</span>
//           </p>
//           <p>
//             <span>Stamina</span>
//             <span>{user1?.attributes.stamina}</span>
//           </p>
//         </div>
//       </div>
//       <div className="battle_equip">
//         <StatBar health={hp.hp1} />
//         <div className={"img_wrapper"}>
//           <img className={"lock_img1"} src={LockSvg} />
//           <img className={"lock_img2"} src={LockSvg} />
//           <img className={"lock_img3"} src={LockSvg} />
//           <img className={"lock_img4"} src={LockSvg} />
//           <img className={"lock_img5"} src={LockSvg} />
//           <img className={"char_svg"} src={CharSvg} />
//           <img className={"lock_img6"} src={LockSvg} />
//           <img className={"lock_img7"} src={LockSvg} />
//           <img className={"lock_img8"} src={LockSvg} />
//           <img className={"lock_img9"} src={LockSvg} />
//         </div>
//       </div>
//     </div>
//     <div className="battle_user2">
//       <div className="battle_data">
//         <div className="battle_user">
//           <div className="battle_name">
//             <p>{user2?.name}</p>
//             <p>
//               <span>Level</span>
//               <span>1</span>
//             </p>
//           </div>
//         </div>
//         <div className="battle_armour">
//           <span>Armour</span>
//           <span>0</span>
//         </div>
//         <div className="battle_stats">
//           <p>
//             <span>Strength</span>
//             <span>{user2?.attributes.strength}</span>
//           </p>

//           <p>
//             <span>Agility</span>
//             <span>{user2?.attributes.agility}</span>
//           </p>
//           <p>
//             <span>Vitality</span>
//             <span>{user2?.attributes.vitality}</span>
//           </p>
//           <p>
//             <span>Stamina</span>
//             <span>{user2?.attributes.stamina}</span>
//           </p>
//         </div>
//       </div>
//       <div className="battle_equip">
//         <StatBar health={hp.hp2} />
//         <div className={"img_wrapper"}>
//           <img className={"lock_img1"} src={LockSvg} />
//           <img className={"lock_img2"} src={LockSvg} />
//           <img className={"lock_img3"} src={LockSvg} />
//           <img className={"lock_img4"} src={LockSvg} />
//           <img className={"lock_img5"} src={LockSvg} />
//           <img className={"char_svg"} src={CharSvg} />
//           <img className={"lock_img6"} src={LockSvg} />
//           <img className={"lock_img7"} src={LockSvg} />
//           <img className={"lock_img8"} src={LockSvg} />
//           <img className={"lock_img9"} src={LockSvg} />
//         </div>
//       </div>
//     </div>
//   </div>
//   <div className="battle_actions">
//     <Button className={"battle_button prev"} onClick={handleOnPrevBattle}>
//       <img src={Back} /> Previous battle
//     </Button>
//     <Button
//       className={"battle_button step_left"}
//       disabled
//       onClick={handleOnPrevLog}
//     >
//       <img src={StepBack} />
//     </Button>
//     <Button className={"battle_button play"} disabled onClick={() => {}}>
//       Play battle
//     </Button>
//     <Button
//       className={"battle_button step_right"}
//       onClick={handleOnNextLog}
//     >
//       <img src={StepForward} />
//     </Button>
//     <Button className={"battle_button next"} onClick={handleOnNextBattle}>
//       Next battle
//       <img src={Forward} />
//     </Button>
//   </div>
//   <div className="battle_logs">
//     <div className="battle_line">
//       <div className="battle_area">
//         <div
//           className="battle_line_user1"
//           style={{
//             left: `${pos.pos1 * 5 + 1}%`,
//           }}
//         />
//         <div
//           className="battle_line_user2"
//           style={{ left: `${pos.pos2 * 5 - 1}%` }}
//         />
//         <div className="battle_axis" />
//       </div>
//     </div>
//     <div className="battle_logs_content">
//       {logs.map((player, i) => {
//         const message = JSON.parse(player.text);
//         const action = Object.keys(message)[0];
//         const value = JSON.stringify(message[action]);

//         if (
//           i + +(battleFinishedIndex[curBattle - 1]?.index ?? "0") >=
//           +battleFinishedIndex[curBattle].index
//         ) {
//           return null;
//         }
//         return (
//           <div
//             className={`battle_log ${
//               i + +(battleFinishedIndex[curBattle - 1]?.index ?? "0") ===
//               curLog
//                 ? "active"
//                 : ""
//             }`}
//           >
//             <p className={"battle_player_name"}>
//               №{i - +(battleFinishedIndex[curBattle - 1]?.index ?? "0")}:{" "}
//               {`${usersOnBattle[player.id].name}`}
//             </p>
//             <p>
//               action: {action}, value = {value}
//             </p>
//           </div>
//         );
//       })}
//     </div>
//   </div>
// </div>
// };
