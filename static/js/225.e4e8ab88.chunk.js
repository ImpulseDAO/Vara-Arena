"use strict";(self.webpackChunkdapp=self.webpackChunkdapp||[]).push([[225],{233:(e,r,t)=>{t.d(r,{j:()=>m});var o=t(2791),s=t(5316);const d=s.ZP.div`
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
`,i=s.ZP.div`
  display: flex;
  align-items: center;
  height: 16px;
  gap: 4px;
  ${e=>{let{position:r}=e;return s.iv`
    justify-content: ${r};
  `}}
`,n=s.ZP.p`
  color: white;
  font-size: 12px;
  font-weight: ${e=>{let{active:r}=e;return r?"bold":"normal"}};
  padding-left: ${e=>{let{isLeftPadded:r}=e;return r?"1.5rem":""}};
`,l=s.ZP.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  height: 40px;
`,a=s.ZP.div`
  display: flex;
  flex-direction: column;
`,c={Container:d,Columns:l,Column:i,ColumnText:n,Row:s.ZP.div`
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
`,Rows:a,Cell:s.ZP.div`
  display: flex;
  ${e=>{let{position:r}=e;return s.iv`
    justify-content: ${r};
  `}}

  cursor: ${e=>{let{ableClick:r}=e;return r?"pointer":"default"}};
`};let u=function(e){return e.ascending="ascending",e.descending="descending",e.default="default",e}({});var p=t(184);const m=e=>{let{columns:r,rows:t,cellClick:s}=e;const[d,i]=(0,o.useState)({field:void 0,sortType:u.default}),n=(e=>{let{sortedColumn:r,rows:t}=e;const[s,d]=(0,o.useState)(t);return(0,o.useEffect)((()=>{const e=[...t],{field:o,sortName:s}=r;o&&(r.sortType===u.ascending&&e.sort(((e,r)=>{const t=s?"sortName":o,d=e[t].toUpperCase(),i=r[t].toUpperCase();return d>i?1:i>d?-1:0})),r.sortType===u.descending&&e.sort(((e,r)=>{const t=s?"sortName":o,d=e[t].toUpperCase(),i=r[t].toUpperCase();return d>i?-1:i>d?1:0}))),d(e)}),[t,r]),s})({rows:t,sortedColumn:d}),l=(e=>{let{columns:r,rows:t,cellClick:s}=e;return(0,o.useMemo)((()=>t.map(((e,t)=>{const o=r.reduce(((r,t,o)=>[...r,(0,p.jsx)(c.Cell,{position:t.position,style:{width:t.width},ableClick:!!s,children:(0,p.jsx)("div",{onClick:()=>null===s||void 0===s?void 0:s(e),children:e[t.field]})},o)]),[]);return(0,p.jsx)(c.Row,{children:o},t)}))),[s,r,t])})({columns:r,rows:n,cellClick:s}),a=(e=>(0,o.useCallback)((r=>()=>{const{field:t,sortable:o,sortName:s}=r;e((e=>{if(!o)return e;if(e.field===t){let r=e.sortType===u.ascending?u.descending:e.sortType===u.descending?u.default:u.ascending;return{field:t,sortType:r,sortName:s}}return{field:t,sortType:u.ascending,sortName:s}}))}),[e]))(i);return(0,p.jsxs)(c.Container,{children:[(0,p.jsx)(c.Columns,{children:r.map(((e,r)=>{var t;return(0,p.jsx)(c.Column,{position:e.position,style:{width:e.width},onClick:a(e),children:(0,p.jsx)(c.ColumnText,{active:d.sortType!==u.default&&d.field===e.field,sortable:null!==(t=e.sortable)&&void 0!==t&&t,isLeftPadded:0===r,children:e.headerName})},e.field)}))}),(0,p.jsx)(c.Rows,{children:l})]})}},7225:(e,r,t)=>{t.r(r),t.d(r,{Leaderboard:()=>m});var o=t(2791),s=t(233),d=t(7689),i=t(3675),n=t(6299),l=t(96),a=t(1353),c=t(9702),u=t(184);const p=[{field:"ownerId",headerName:"Owner Id",width:645,position:"center"},{field:"nw",headerName:"number of wins",width:120,position:"center"}],m=()=>{const e=(0,d.s0)(),{account:r}=(0,i.mA)(),{buffer:t}=(0,a.Z)(l),m=c.Pj.from(n.Rv),f=(0,o.useMemo)((()=>({programId:n.mC,programMetadata:m,wasm:t,functionName:"leaderboard",argument:null===r||void 0===r?void 0:r.decodedAddress})),[t,null===r||void 0===r?void 0:r.decodedAddress,m]),h=(0,i.J1)(f).state,b=(0,o.useMemo)((()=>h?Object.keys(h).map((e=>({ownerId:(0,u.jsxs)("p",{className:"row_ownerId",children:["\ud83d\udd17 ",e]}),nw:h[e]}))).sort(((e,r)=>Number(r.nw)-Number(e.nw))):[]),[h]),x=(0,o.useCallback)((r=>{e(`/profile/${r.ownerId.props.children[1]}`)}),[e]);return(0,u.jsx)("div",{className:"leaderboard",children:(0,u.jsxs)("div",{className:"modal_leaderboard",children:[(0,u.jsx)("div",{className:"header",children:"Leaderboard"}),(0,u.jsx)("div",{className:"scroll_container",children:(0,u.jsx)("div",{className:"modal_table",children:(0,u.jsx)(s.j,{rows:b,columns:p,cellClick:x})})})]})})}},1353:(e,r,t)=>{t.d(r,{Z:()=>i});var o=t(3675),s=t(2791),d=t(9778).lW;const i=e=>{const r=(0,o.VY)(),[t,i]=(0,s.useState)();return(0,s.useEffect)((()=>{e&&fetch(e).then((e=>e.arrayBuffer())).then((e=>d.from(e))).then((e=>i(e))).catch((e=>{let{message:t}=e;return r.error(`Fetch error: ${t}`)}))}),[r,e]),{buffer:t}}},96:(e,r,t)=>{e.exports=t.p+"static/media/arena.opt.184dc702b5c0a56042cf.wasm"}}]);
//# sourceMappingURL=225.e4e8ab88.chunk.js.map