import{r as n}from"./react-DLwQdj7q.js";import{A as C,i as b,p as y,s as O}from"./@remix-run-BBWqMfS0.js";/**
 * React Router v6.30.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function i(){return i=Object.assign?Object.assign.bind():function(t){for(var a=1;a<arguments.length;a++){var o=arguments[a];for(var e in o)Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e])}return t},i.apply(this,arguments)}const _=n.createContext(null),x=n.createContext(null);function j(){return n.useContext(x)!=null}function w(t,a){t==null||t.v7_startTransition,t==null||t.v7_relativeSplatPath}function A(t){let{basename:a="/",children:o=null,location:e,navigationType:l=C.Pop,navigator:s,static:u=!1,future:c}=t;j()&&b(!1);let r=a.replace(/^\/*/,"/"),d=n.useMemo(()=>({basename:r,navigator:s,static:u,future:i({v7_relativeSplatPath:!1},c)}),[r,c,s,u]);typeof e=="string"&&(e=y(e));let{pathname:p="/",search:f="",hash:v="",state:m=null,key:g="default"}=e,h=n.useMemo(()=>{let P=O(p,r);return P==null?null:{location:{pathname:P,search:f,hash:v,state:m,key:g},navigationType:l}},[r,p,f,v,m,g,l]);return h==null?null:n.createElement(_.Provider,{value:d},n.createElement(x.Provider,{children:o,value:h}))}new Promise(()=>{});export{A as R,w as l};
