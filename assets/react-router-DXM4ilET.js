import{a}from"./react-BW4aR-Eg.js";import{A as C,i as b,p as y,s as _}from"./@remix-run-C06S_O1E.js";/**
 * React Router v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function r(){return r=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var o=arguments[n];for(var e in o)({}).hasOwnProperty.call(o,e)&&(t[e]=o[e])}return t},r.apply(null,arguments)}const E=a.createContext(null),x=a.createContext(null);function O(){return a.useContext(x)!=null}function w(t,n){t==null||t.v7_startTransition,t==null||t.v7_relativeSplatPath}function A(t){let{basename:n="/",children:o=null,location:e,navigationType:i=C.Pop,navigator:s,static:u=!1,future:c}=t;O()&&b(!1);let l=n.replace(/^\/*/,"/"),d=a.useMemo(()=>({basename:l,navigator:s,static:u,future:r({v7_relativeSplatPath:!1},c)}),[l,c,s,u]);typeof e=="string"&&(e=y(e));let{pathname:p="/",search:v="",hash:f="",state:m=null,key:g="default"}=e,h=a.useMemo(()=>{let P=_(p,l);return P==null?null:{location:{pathname:P,search:v,hash:f,state:m,key:g},navigationType:i}},[l,p,v,f,m,g,i]);return h==null?null:a.createElement(E.Provider,{value:d},a.createElement(x.Provider,{children:o,value:h}))}new Promise(()=>{});export{A as R,w as l};
