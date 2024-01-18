"use strict";(self.webpackChunkdapp=self.webpackChunkdapp||[]).push([[619],{1619:(e,t,r)=>{r.d(t,{x:()=>_});var o=r(2791),n=r(2020),l=r(5838),a=r(6519),s=r(204),i=r(245),c=r(8592),u=r(4799);const[d,f]=(0,u.R)("ScrollArea.Root component was not found in tree");function p(e){const t=(0,o.useRef)(e);return(0,o.useEffect)((()=>{t.current=e})),(0,o.useMemo)((()=>function(){for(var e,r=arguments.length,o=new Array(r),n=0;n<r;n++)o[n]=arguments[n];return null===(e=t.current)||void 0===e?void 0:e.call(t,...o)}),[])}var h=r(2498);function v(e,t){const r=p(t);(0,h.Y)((()=>{let t=0;if(e){const o=new ResizeObserver((()=>{cancelAnimationFrame(t),t=window.requestAnimationFrame(r)}));return o.observe(e),()=>{window.cancelAnimationFrame(t),o.unobserve(e)}}}),[e,r])}const w=o.forwardRef(((e,t)=>{const{style:r,...n}=e,l=f(),[a,s]=o.useState(0),[i,c]=o.useState(0),u=Boolean(a&&i);return v(l.scrollbarX,(()=>{var e;const t=(null===(e=l.scrollbarX)||void 0===e?void 0:e.offsetHeight)||0;l.onCornerHeightChange(t),c(t)})),v(l.scrollbarY,(()=>{var e;const t=(null===(e=l.scrollbarY)||void 0===e?void 0:e.offsetWidth)||0;l.onCornerWidthChange(t),s(t)})),u?o.createElement("div",{...n,ref:t,style:{...r,width:a,height:i}}):null})),m=o.forwardRef(((e,t)=>{const r=f(),n=Boolean(r.scrollbarX&&r.scrollbarY);return"scroll"!==r.type&&n?o.createElement(w,{...e,ref:t}):null}));var b=r(6504);const g={scrollHideDelay:1e3,type:"hover"},y=(0,o.forwardRef)(((e,t)=>{const r=(0,a.w)("ScrollAreaRoot",g,e),{type:n,scrollHideDelay:l,scrollbars:s,...c}=r,[u,f]=(0,o.useState)(null),[p,h]=(0,o.useState)(null),[v,w]=(0,o.useState)(null),[m,y]=(0,o.useState)(null),[S,E]=(0,o.useState)(null),[C,T]=(0,o.useState)(0),[P,R]=(0,o.useState)(0),[x,D]=(0,o.useState)(!1),[z,L]=(0,o.useState)(!1),A=(0,b.Yx)(t,(e=>f(e)));return o.createElement(d,{value:{type:n,scrollHideDelay:l,scrollArea:u,viewport:p,onViewportChange:h,content:v,onContentChange:w,scrollbarX:m,onScrollbarXChange:y,scrollbarXEnabled:x,onScrollbarXEnabledChange:D,scrollbarY:S,onScrollbarYChange:E,scrollbarYEnabled:z,onScrollbarYEnabledChange:L,onCornerWidthChange:T,onCornerHeightChange:R}},o.createElement(i.x,{...c,ref:A,__vars:{"--sa-corner-width":"xy"!==s?"0px":`${C}px`,"--sa-corner-height":"xy"!==s?"0px":`${P}px`}}))}));function S(e,t){const r=p(e),n=(0,o.useRef)(0);return(0,o.useEffect)((()=>()=>window.clearTimeout(n.current)),[]),(0,o.useCallback)((()=>{window.clearTimeout(n.current),n.current=window.setTimeout(r,t)}),[r,t])}y.displayName="@mantine/core/ScrollAreaRoot";var E=r(8290);function C(e,t){const r=e/t;return Number.isNaN(r)?0:r}function T(e){const t=C(e.viewport,e.content),r=e.scrollbar.paddingStart+e.scrollbar.paddingEnd,o=(e.scrollbar.size-r)*t;return Math.max(o,18)}function P(e,t){return r=>{if(e[0]===e[1]||t[0]===t[1])return t[0];const o=(t[1]-t[0])/(e[1]-e[0]);return t[0]+o*(r-e[0])}}function R(e,t){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"ltr";const o=T(t),n=t.scrollbar.paddingStart+t.scrollbar.paddingEnd,l=t.scrollbar.size-n,a=t.content-t.viewport,s=l-o,i=function(e,t){let[r,o]=t;return Math.min(o,Math.max(r,e))}(e,"ltr"===r?[0,a]:[-1*a,0]);return P([0,a],[0,s])(i)}function x(e,t){return e>0&&e<t}function D(e){return e?parseInt(e,10):0}function z(e,t){let{checkForDefaultPrevented:r=!0}=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return o=>{null===e||void 0===e||e(o),!1!==r&&o.defaultPrevented||null===t||void 0===t||t(o)}}const[L,A]=(0,u.R)("ScrollAreaScrollbar was not found in tree"),Y=(0,o.forwardRef)(((e,t)=>{const{sizes:r,hasThumb:n,onThumbChange:l,onThumbPointerUp:a,onThumbPointerDown:s,onThumbPositionChange:i,onDragScroll:c,onWheelScroll:u,onResize:d,...h}=e,w=f(),[m,g]=o.useState(null),y=(0,b.Yx)(t,(e=>g(e))),E=o.useRef(null),C=o.useRef(""),{viewport:T}=w,P=r.content-r.viewport,R=p(u),x=p(i),D=S(d,10),A=e=>{if(E.current){const t=e.clientX-E.current.left,r=e.clientY-E.current.top;c({x:t,y:r})}};return(0,o.useEffect)((()=>{const e=e=>{const t=e.target;(null===m||void 0===m?void 0:m.contains(t))&&R(e,P)};return document.addEventListener("wheel",e,{passive:!1}),()=>document.removeEventListener("wheel",e,{passive:!1})}),[T,m,P,R]),(0,o.useEffect)(x,[r,x]),v(m,D),v(w.content,D),o.createElement(L,{value:{scrollbar:m,hasThumb:n,onThumbChange:p(l),onThumbPointerUp:p(a),onThumbPositionChange:x,onThumbPointerDown:p(s)}},o.createElement("div",{...h,ref:y,style:{position:"absolute",...h.style},onPointerDown:z(e.onPointerDown,(e=>{if(0===e.button){e.target.setPointerCapture(e.pointerId),E.current=m.getBoundingClientRect(),C.current=document.body.style.webkitUserSelect,document.body.style.webkitUserSelect="none",A(e)}})),onPointerMove:z(e.onPointerMove,A),onPointerUp:z(e.onPointerUp,(e=>{const t=e.target;t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId),document.body.style.webkitUserSelect=C.current,E.current=null}))}))})),H=(0,o.forwardRef)(((e,t)=>{const{sizes:r,onSizesChange:n,style:l,...a}=e,s=f(),[i,c]=(0,o.useState)(),u=(0,o.useRef)(null),d=(0,b.Yx)(t,u,s.onScrollbarXChange);return(0,o.useEffect)((()=>{u.current&&c(getComputedStyle(u.current))}),[u]),o.createElement(Y,{"data-orientation":"horizontal",...a,ref:d,sizes:r,style:{...l,"--sa-thumb-width":`${T(r)}px`},onThumbPointerDown:t=>e.onThumbPointerDown(t.x),onDragScroll:t=>e.onDragScroll(t.x),onWheelScroll:(t,r)=>{if(s.viewport){const o=s.viewport.scrollLeft+t.deltaX;e.onWheelScroll(o),x(o,r)&&t.preventDefault()}},onResize:()=>{u.current&&s.viewport&&i&&n({content:s.viewport.scrollWidth,viewport:s.viewport.offsetWidth,scrollbar:{size:u.current.clientWidth,paddingStart:D(i.paddingLeft),paddingEnd:D(i.paddingRight)}})}})})),M=(0,o.forwardRef)(((e,t)=>{const{sizes:r,onSizesChange:n,style:l,...a}=e,s=f(),[i,c]=o.useState(),u=(0,o.useRef)(null),d=(0,b.Yx)(t,u,s.onScrollbarYChange);return(0,o.useEffect)((()=>{u.current&&c(getComputedStyle(u.current))}),[u]),o.createElement(Y,{...a,"data-orientation":"vertical",ref:d,sizes:r,style:{"--sa-thumb-height":`${T(r)}px`,...l},onThumbPointerDown:t=>e.onThumbPointerDown(t.y),onDragScroll:t=>e.onDragScroll(t.y),onWheelScroll:(t,r)=>{if(s.viewport){const o=s.viewport.scrollTop+t.deltaY;e.onWheelScroll(o),x(o,r)&&t.preventDefault()}},onResize:()=>{u.current&&s.viewport&&i&&n({content:s.viewport.scrollHeight,viewport:s.viewport.offsetHeight,scrollbar:{size:u.current.clientHeight,paddingStart:D(i.paddingTop),paddingEnd:D(i.paddingBottom)}})}})})),W=(0,o.forwardRef)(((e,t)=>{const{orientation:r="vertical",...n}=e,{dir:l}=(0,E.gm)(),a=f(),s=(0,o.useRef)(null),i=(0,o.useRef)(0),[c,u]=(0,o.useState)({content:0,viewport:0,scrollbar:{size:0,paddingStart:0,paddingEnd:0}}),d=C(c.viewport,c.content),p={...n,sizes:c,onSizesChange:u,hasThumb:Boolean(d>0&&d<1),onThumbChange:e=>{s.current=e},onThumbPointerUp:()=>{i.current=0},onThumbPointerDown:e=>{i.current=e}},h=(e,t)=>function(e,t,r){let o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"ltr";const n=T(r),l=t||n/2,a=n-l,s=r.scrollbar.paddingStart+l,i=r.scrollbar.size-r.scrollbar.paddingEnd-a,c=r.content-r.viewport;return P([s,i],"ltr"===o?[0,c]:[-1*c,0])(e)}(e,i.current,c,t);return"horizontal"===r?o.createElement(H,{...p,ref:t,onThumbPositionChange:()=>{if(a.viewport&&s.current){const e=R(a.viewport.scrollLeft,c,l);s.current.style.transform=`translate3d(${e}px, 0, 0)`}},onWheelScroll:e=>{a.viewport&&(a.viewport.scrollLeft=e)},onDragScroll:e=>{a.viewport&&(a.viewport.scrollLeft=h(e,l))}}):"vertical"===r?o.createElement(M,{...p,ref:t,onThumbPositionChange:()=>{if(a.viewport&&s.current){const e=R(a.viewport.scrollTop,c);s.current.style.transform=`translate3d(0, ${e}px, 0)`}},onWheelScroll:e=>{a.viewport&&(a.viewport.scrollTop=e)},onDragScroll:e=>{a.viewport&&(a.viewport.scrollTop=h(e))}}):null})),X=(0,o.forwardRef)(((e,t)=>{const r=f(),{forceMount:n,...l}=e,[a,s]=(0,o.useState)(!1),i="horizontal"===e.orientation,c=S((()=>{if(r.viewport){const e=r.viewport.offsetWidth<r.viewport.scrollWidth,t=r.viewport.offsetHeight<r.viewport.scrollHeight;s(i?e:t)}}),10);return v(r.viewport,c),v(r.content,c),n||a?o.createElement(W,{"data-state":a?"visible":"hidden",...l,ref:t}):null})),N=(0,o.forwardRef)(((e,t)=>{const{forceMount:r,...n}=e,l=f(),[a,s]=(0,o.useState)(!1);return(0,o.useEffect)((()=>{const{scrollArea:e}=l;let t=0;if(e){const r=()=>{window.clearTimeout(t),s(!0)},o=()=>{t=window.setTimeout((()=>s(!1)),l.scrollHideDelay)};return e.addEventListener("pointerenter",r),e.addEventListener("pointerleave",o),()=>{window.clearTimeout(t),e.removeEventListener("pointerenter",r),e.removeEventListener("pointerleave",o)}}}),[l.scrollArea,l.scrollHideDelay]),r||a?o.createElement(X,{"data-state":a?"visible":"hidden",...n,ref:t}):null})),U=(0,o.forwardRef)(((e,t)=>{const{forceMount:r,...n}=e,l=f(),a="horizontal"===e.orientation,[s,i]=(0,o.useState)("hidden"),c=S((()=>i("idle")),100);return(0,o.useEffect)((()=>{if("idle"===s){const e=window.setTimeout((()=>i("hidden")),l.scrollHideDelay);return()=>window.clearTimeout(e)}}),[s,l.scrollHideDelay]),(0,o.useEffect)((()=>{const{viewport:e}=l,t=a?"scrollLeft":"scrollTop";if(e){let r=e[t];const o=()=>{const o=e[t];r!==o&&(i("scrolling"),c()),r=o};return e.addEventListener("scroll",o),()=>e.removeEventListener("scroll",o)}}),[l.viewport,a,c]),r||"hidden"!==s?o.createElement(W,{"data-state":"hidden"===s?"hidden":"visible",...n,ref:t,onPointerEnter:z(e.onPointerEnter,(()=>i("interacting"))),onPointerLeave:z(e.onPointerLeave,(()=>i("idle")))}):null})),k=o.forwardRef(((e,t)=>{const{forceMount:r,...n}=e,l=f(),{onScrollbarXEnabledChange:a,onScrollbarYEnabledChange:s}=l,i="horizontal"===e.orientation;return o.useEffect((()=>(i?a(!0):s(!0),()=>{i?a(!1):s(!1)})),[i,a,s]),"hover"===l.type?o.createElement(N,{...n,ref:t,forceMount:r}):"scroll"===l.type?o.createElement(U,{...n,ref:t,forceMount:r}):"auto"===l.type?o.createElement(X,{...n,ref:t,forceMount:r}):"always"===l.type?o.createElement(W,{...n,ref:t}):null}));const B=(0,o.forwardRef)(((e,t)=>{const{style:r,...n}=e,l=f(),a=A(),{onThumbPositionChange:s}=a,i=(0,b.Yx)(t,(e=>a.onThumbChange(e))),c=(0,o.useRef)(),u=S((()=>{c.current&&(c.current(),c.current=void 0)}),100);return(0,o.useEffect)((()=>{const{viewport:e}=l;if(e){const t=()=>{if(u(),!c.current){const t=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:()=>{},r={left:e.scrollLeft,top:e.scrollTop},o=0;return function n(){const l={left:e.scrollLeft,top:e.scrollTop},a=r.left!==l.left,s=r.top!==l.top;(a||s)&&t(),r=l,o=window.requestAnimationFrame(n)}(),()=>window.cancelAnimationFrame(o)}(e,s);c.current=t,s()}};return s(),e.addEventListener("scroll",t),()=>e.removeEventListener("scroll",t)}}),[l.viewport,u,s]),o.createElement("div",{"data-state":a.hasThumb?"visible":"hidden",...n,ref:i,style:{width:"var(--sa-thumb-width)",height:"var(--sa-thumb-height)",...r},onPointerDownCapture:z(e.onPointerDownCapture,(e=>{const t=e.target.getBoundingClientRect(),r=e.clientX-t.left,o=e.clientY-t.top;a.onThumbPointerDown({x:r,y:o})})),onPointerUp:z(e.onPointerUp,a.onThumbPointerUp)})})),F=o.forwardRef(((e,t)=>{const{forceMount:r,...n}=e,l=A();return r||l.hasThumb?o.createElement(B,{ref:t,...n}):null})),$=(0,o.forwardRef)(((e,t)=>{let{children:r,style:n,...l}=e;const a=f(),s=(0,b.Yx)(t,a.onViewportChange);return o.createElement(i.x,{...l,ref:s,style:{overflowX:a.scrollbarXEnabled?"scroll":"hidden",overflowY:a.scrollbarYEnabled?"scroll":"hidden",...n}},o.createElement("div",{style:{minWidth:"100%",display:"table"},ref:a.onContentChange},r))}));$.displayName="@mantine/core/ScrollAreaViewport";var I={root:"m-d57069b5",viewport:"m-c0783ff9",viewportInner:"m-f8f631dd",scrollbar:"m-c44ba933",thumb:"m-d8b5e363",corner:"m-21657268"};const V={scrollHideDelay:1e3,type:"hover",scrollbars:"xy"},q=(0,l.Z)(((e,t)=>{let{scrollbarSize:r}=t;return{root:{"--scrollarea-scrollbar-size":(0,n.h)(r)}}})),_=(0,c.d)(((e,t)=>{const r=(0,a.w)("ScrollArea",V,e),{classNames:n,className:l,style:i,styles:c,unstyled:u,scrollbarSize:d,vars:f,type:p,scrollHideDelay:h,viewportProps:v,viewportRef:w,onScrollPositionChange:b,children:g,offsetScrollbars:S,scrollbars:E,...C}=r,[T,P]=(0,o.useState)(!1),R=(0,s.y)({name:"ScrollArea",props:r,classes:I,className:l,style:i,classNames:n,styles:c,unstyled:u,vars:f,varsResolver:q});return o.createElement(y,{type:"never"===p?"always":p,scrollHideDelay:h,ref:t,scrollbars:E,...R("root"),...C},o.createElement($,{...v,...R("viewport"),ref:w,"data-offset-scrollbars":!0===S?"xy":S||void 0,"data-scrollbars":E||void 0,onScroll:"function"===typeof b?e=>{let{currentTarget:t}=e;return b({x:t.scrollLeft,y:t.scrollTop})}:void 0},g),("xy"===E||"x"===E)&&o.createElement(k,{...R("scrollbar"),orientation:"horizontal","data-hidden":"never"===p||void 0,forceMount:!0,onMouseEnter:()=>P(!0),onMouseLeave:()=>P(!1)},o.createElement(F,{...R("thumb")})),("xy"===E||"y"===E)&&o.createElement(k,{...R("scrollbar"),orientation:"vertical","data-hidden":"never"===p||void 0,forceMount:!0,onMouseEnter:()=>P(!0),onMouseLeave:()=>P(!1)},o.createElement(F,{...R("thumb")})),o.createElement(m,{...R("corner"),"data-hovered":T||void 0,"data-hidden":"never"===p||void 0}))}));_.displayName="@mantine/core/ScrollArea";const O=(0,c.d)(((e,t)=>{const{children:r,classNames:n,styles:l,scrollbarSize:s,scrollHideDelay:c,type:u,dir:d,offsetScrollbars:f,viewportRef:p,onScrollPositionChange:h,unstyled:v,variant:w,viewportProps:m,scrollbars:b,style:g,vars:y,...S}=(0,a.w)("ScrollAreaAutosize",V,e);return o.createElement(i.x,{...S,ref:t,style:[{display:"flex"},g]},o.createElement(i.x,{style:{display:"flex",flexDirection:"column",flex:1}},o.createElement(_,{classNames:n,styles:l,scrollHideDelay:c,scrollbarSize:s,type:u,dir:d,offsetScrollbars:f,viewportRef:p,onScrollPositionChange:h,unstyled:v,variant:w,viewportProps:m,vars:y,scrollbars:b},r)))}));_.classes=I,O.displayName="@mantine/core/ScrollAreaAutosize",O.classes=I,_.Autosize=O},4799:(e,t,r)=>{r.d(t,{R:()=>n});var o=r(2791);function n(e){const t=(0,o.createContext)(null);return[e=>{let{children:r,value:n}=e;return o.createElement(t.Provider,{value:n},r)},()=>{const r=(0,o.useContext)(t);if(null===r)throw new Error(e);return r}]}}}]);
//# sourceMappingURL=619.0ca2deb9.chunk.js.map