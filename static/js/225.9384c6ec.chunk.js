"use strict";(self.webpackChunkdapp=self.webpackChunkdapp||[]).push([[225],{8311:(e,r,t)=>{t.d(r,{AX:()=>s,C7:()=>c,iV:()=>l});var n=t(3675),i=t(6070),o=t(3051),d=t(9664);(0,i.B)("\n  query AllCharacters {\n    characters {\n      id\n      level\n      name\n      owner\n      experience\n      attributes\n    }\n  }\n");const a=(0,i.B)("\n  query CharactersByOwner($owner_eq: String!) {\n    characters(where: { owner_eq: $owner_eq }) {\n      id\n      level\n      name\n      owner\n      experience\n      attributes\n    }\n  }\n"),l=()=>{const e=(0,o.P)(a);d.E.invalidateQueries({queryKey:[e]})},s=e=>{let{owner_eq:r}=e;return(0,o.a)(a,{owner_eq:r})},c=()=>{var e;const{account:r}=(0,n.mA)(),t=s({owner_eq:null!==(e=null===r||void 0===r?void 0:r.decodedAddress)&&void 0!==e?e:""}),i=t.data;return{...t,data:null===i||void 0===i?void 0:i.characters[(null===i||void 0===i?void 0:i.characters.length)-1]}};(0,i.B)("\n  query CharacterById($character_id: String!) {\n    characterById(id: $character_id) {\n      attributes\n      experience\n      id\n      level\n      name\n      owner\n    }\n  }\n")},6880:(e,r,t)=>{t.d(r,{OY:()=>s,M:()=>c,OV:()=>u});var n=t(9702),i=t(6299),o=t(1313),d=t(5863),a=t(3675);var l=t(8311);const s=(0,d.r)({use:[e=>r=>{const{api:t}=(0,a.h_)();return e({...r,meta:{...r.meta,api:t}})}],queryKey:["mintProgramState"],fetcher:async(e,r)=>{var t;let{programId:i,metadata:o}=e;const d=n.Pj.from(o),a=null===(t=r.meta)||void 0===t?void 0:t.api,l=await(null===a||void 0===a?void 0:a.programState.read({programId:i,payload:void 0},d));return null===l||void 0===l?void 0:l.toJSON()}}),c=()=>{const e=(0,o.i)();return s({variables:{metadata:i.cV,programId:i.ZB},select:r=>{var t,n;return null!==(t=null===(n=r.characters)||void 0===n?void 0:n[null!==e&&void 0!==e?e:""])&&void 0!==t?t:null}})},u=()=>{var e;const r=null!==(e=(0,o.i)())&&void 0!==e?e:"",{data:t}=(0,l.AX)({owner_eq:r}),{data:n}=c();return{isDead:0!==(null===t||void 0===t?void 0:t.characters.length)&&!n,isFresh:0===(null===t||void 0===t?void 0:t.characters.length)}}},233:(e,r,t)=>{t.d(r,{j:()=>h});var n=t(2791),i=t(5316);const o=i.ZP.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border-left: 2px solid white;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;

  overflow: hidden;
`,d=i.ZP.div`
  display: flex;
  align-items: center;
  height: 16px;
  gap: 4px;
  ${e=>{let{position:r}=e;return i.iv`
    justify-content: ${r};
  `}}
`,a=i.ZP.p`
  color: white;
  font-size: 12px;
  font-weight: ${e=>{let{active:r}=e;return r?"bold":"normal"}};
  padding-left: ${e=>{let{isLeftPadded:r}=e;return r?"1.5rem":""}};
`,l=i.ZP.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  height: 40px;
`,s=i.ZP.div`
  display: flex;
  flex-direction: column;
`,c={Container:o,Columns:l,Column:d,ColumnText:a,Row:i.ZP.div`
  height: 72px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: white;
  background: rgba(0, 0, 0, 0.7);
  border-top: 1px solid white;

  position: relative;

  &:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
`,Rows:s,Cell:i.ZP.div`
  display: flex;
  ${e=>{let{position:r}=e;return i.iv`
    justify-content: ${r};
  `}}

  cursor: ${e=>{let{ableClick:r}=e;return r?"pointer":"default"}};
`};let u=function(e){return e.ascending="ascending",e.descending="descending",e.default="default",e}({});var p=t(184);const h=e=>{let{columns:r,rows:t,cellClick:i}=e;const[o,d]=(0,n.useState)({field:void 0,sortType:u.default}),a=(e=>{let{sortedColumn:r,rows:t}=e;const[i,o]=(0,n.useState)(t);return(0,n.useEffect)((()=>{const e=[...t],{field:n,sortName:i}=r;n&&(r.sortType===u.ascending&&e.sort(((e,r)=>{const t=i?"sortName":n,o=e[t].toUpperCase(),d=r[t].toUpperCase();return o>d?1:d>o?-1:0})),r.sortType===u.descending&&e.sort(((e,r)=>{const t=i?"sortName":n,o=e[t].toUpperCase(),d=r[t].toUpperCase();return o>d?-1:d>o?1:0}))),o(e)}),[t,r]),i})({rows:t,sortedColumn:o}),l=(e=>{let{columns:r,rows:t,cellClick:i}=e;return(0,n.useMemo)((()=>t.map(((e,t)=>{const n=r.reduce(((r,t,n)=>[...r,(0,p.jsx)(c.Cell,{position:t.position,style:{width:t.width},ableClick:!!i,children:(0,p.jsx)("div",{onClick:()=>null===i||void 0===i?void 0:i(e),children:e[t.field]})},n)]),[]);return(0,p.jsx)(c.Row,{children:n},t)}))),[i,r,t])})({columns:r,rows:a,cellClick:i}),s=(e=>(0,n.useCallback)((r=>()=>{const{field:t,sortable:n,sortName:i}=r;e((e=>{if(!n)return e;if(e.field===t){let r=e.sortType===u.ascending?u.descending:e.sortType===u.descending?u.default:u.ascending;return{field:t,sortType:r,sortName:i}}return{field:t,sortType:u.ascending,sortName:i}}))}),[e]))(d);return(0,p.jsxs)(c.Container,{children:[(0,p.jsx)(c.Columns,{children:r.map(((e,r)=>{var t;return(0,p.jsx)(c.Column,{position:e.position,style:{width:e.width},onClick:s(e),children:(0,p.jsx)(c.ColumnText,{active:o.sortType!==u.default&&o.field===e.field,sortable:null!==(t=e.sortable)&&void 0!==t&&t,isLeftPadded:0===r,children:e.headerName})},e.field)}))}),(0,p.jsx)(c.Rows,{children:l})]})}},1313:(e,r,t)=>{t.d(r,{i:()=>i});var n=t(3675);const i=()=>{const{account:e}=(0,n.mA)();return null===e||void 0===e?void 0:e.decodedAddress}},7225:(e,r,t)=>{t.r(r),t.d(r,{Leaderboard:()=>s});var n=t(2791),i=t(233),o=t(7689),d=t(6880),a=t(184);const l=[{field:"ownerId",headerName:"Owner Id",width:645,position:"center"},{field:"nw",headerName:"number of wins",width:120,position:"center"}],s=()=>{const e=(0,o.s0)(),{data:r}=(0,d.OY)(),{characters:t}=null!==r&&void 0!==r?r:{characters:{}};Object.entries(t).sort(((e,r)=>{let[t,n]=e,[i,o]=r;n.attributes.tierRating,o.attributes.tierRating;return 1}));const s=(0,n.useCallback)((r=>{e(`/profile/${r.ownerId.props.children[1]}`)}),[e]);return(0,a.jsx)("div",{className:"leaderboard",children:(0,a.jsxs)("div",{className:"modal_leaderboard",children:[(0,a.jsx)("div",{className:"header",children:"Leaderboard"}),(0,a.jsx)("div",{className:"scroll_container",children:(0,a.jsx)("div",{className:"modal_table",children:(0,a.jsx)(i.j,{rows:[],columns:l,cellClick:s})})})]})})}}}]);
//# sourceMappingURL=225.9384c6ec.chunk.js.map