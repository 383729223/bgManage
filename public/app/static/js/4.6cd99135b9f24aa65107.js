webpackJsonp([4],{P7ry:function(t,s,e){"use strict";Object.defineProperty(s,"__esModule",{value:!0});e("34+y");var n=e("X+yh"),a=e.n(n),o=(e("lrMw"),e("7YS2")),r=e.n(o),i=(e("f1Vh"),e("ZQVe")),c=e.n(i),l=(e("y+mr"),e("3JdW")),u=e.n(l),p=e("7+uW"),d=e("bYAN"),h=e("mtWM"),f=e.n(h);e("NYxO");p.default.use(u.a,c.a,r.a);var m={name:"register",components:{Backheader:d.a},data:function(){return{phone:"",password:""}},methods:{login:function(){var t=this;f.a.post("https://www.daxunxun.com/users/login",{username:this.phone,password:this.password}).then(function(s){-1===s.data?a()({message:"密 码 错 误",iconClass:"iconfont icon-Warning"}):2===s.data?a()({message:"没有该用户",iconClass:"iconfont icon-error"}):0===s.data?a()({message:"登 录 失 败",iconClass:"iconfont icon-error"}):(a()({message:"登 陆 成 功",iconClass:"iconfont icon-popsuccess"}),t.$store.commit("changeLoginState",!0),t.$router.push("/user"))}).catch(function(t){return console.log(t)})}},computed:{phoneState:function(){return""===this.phone?"":/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.phone)?"success":"error"},passwordState:function(){return""===this.password?"":this.password.length>=6?"success":"error"},type:function(){return"success"===this.phoneState&&"success"===this.passwordState?"primary":"default"},isAllOk:function(){return"success"!==this.phoneState||"success"!==this.passwordState}}},v={render:function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"container"},[n("Backheader"),t._v(" "),n("div",{staticClass:"content"},[n("div",{staticClass:"loginbox"},[n("div",{staticClass:"box"},[n("mt-cell",{staticClass:"loginTitle",attrs:{title:"用户登录"}},[n("span",{staticClass:"note"},[t._v("欢迎登录优奇美商城")]),t._v(" "),n("img",{attrs:{slot:"icon",src:e("R+PB"),width:"24",height:"24"},slot:"icon"})]),t._v(" "),n("mt-field",{attrs:{placeholder:"请输入手机号",type:"tel",state:t.phoneState},model:{value:t.phone,callback:function(s){t.phone=s},expression:"phone"}}),t._v(" "),n("mt-field",{attrs:{placeholder:"请输入密码",type:"password",state:t.passwordState},model:{value:t.password,callback:function(s){t.password=s},expression:"password"}}),t._v(" "),n("mt-button",{attrs:{type:t.type,size:"large",disabled:t.isAllOk},nativeOn:{click:function(s){return t.login(s)}}},[t._v("登录")])],1)])])],1)},staticRenderFns:[]};var w=e("VU/8")(m,v,!1,function(t){e("nppY")},null,null);s.default=w.exports},nppY:function(t,s){}});
//# sourceMappingURL=4.6cd99135b9f24aa65107.js.map