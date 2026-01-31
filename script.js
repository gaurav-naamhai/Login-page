const idGenreator=()=>{
   return Date.now().toString();
};
const checkUser=()=>{
try{
const raw=localStorage.getItem("users");
if(!raw)return [];
const parsed=JSON.parse(raw);
if(!Array.isArray(parsed))return [];
return parsed.filter(u=>u && typeof u.email=="string"&& typeof u.password=="string");
}
catch{
return [];
}
};
const state={
users:checkUser(),
editingID:null
};
let log=document.getElementById("login");
let userList=document.getElementById("uo");
let email=document.getElementById("userid");
let pas=document.getElementById("pass");
let  msg=document.getElementById("msg");
const normalizeEmail=(value)=>{
    return value.trim().toLowerCase();
};
const saveUsers=()=>{
    localStorage.setItem("users",JSON.stringify(state.users));
};
const updateUI=()=>{
    renderUser();
};
log.disabled=true;
console.log("Entered Users are:",state.users);
const isExist = (users, emailValue) => {
    return users.some(u => {
        if(state.editingID && u.id === state.editingID) return false;
        return u.email === emailValue;
    });
};

const mes=(text,color)=>{
    msg.innerText=text;
    msg.style.color=color;
};


const logFunc=(event)=>{
event.preventDefault();
if(normalizeEmail(email.value)===""||pas.value==""){
mes("Password enter Toh Kar Saale","red");
    email.value="";
}else if(pas.value.length<6){
mes("6 Char se jyada daal","blue");
    email.value = "";
    pas.value = "";
    log.disabled=true;
}else{
mes("Hogya Login","green");
    let user={
        id:idGenreator(),
    email:normalizeEmail(email.value),
    password: pas.value
};
if(state.editingID){
state.users=state.users.map(u=>{
    if(u.id===state.editingID){
        return{
            ...u,
            email: normalizeEmail(email.value)
        };
    }
    return u;    
});
state.editingID=null;
saveUsers();
updateUI();
return;
}
const exist=isExist(state.users,normalizeEmail(email.value));
if(exist){
    mes("Ek Baar Hogya Naa","orange");
    return;
}
state.users=[...state.users,user];
saveUsers();
updateUI();
// console.log(users);
let emails=state.users.map(({email})=> email);
console.log(emails);
    email.value="";
    pas.value = "";
    log.disabled=true;
}};


const diss=()=>{
if(normalizeEmail(email.value)===""&&pas.value==""){
log.disabled=true;
} 
else{
log.disabled=false;
}};


const liv=()=>{
if(normalizeEmail(email.value)===""){
mes("Enter Email","red");
}else if(pas.value==""){
mes("Enter Password","red");
}else if(pas.value.length<6){
mes("Min. Password Char is 6","red");
}else{
mes("","black");
}};
const del=(id)=>{
state.users=state.users.filter(u=>u.id!==id);
saveUsers();
updateUI();
};
const edit=(id)=>{
    const user=state.users.find(u=>u.id==id);
    if(!user)return;
state.editingID=id;
email.value=user.email;
};
const renderUser=()=>{
userList.innerHTML="";
state.users.forEach((u) => {
    const li=document.createElement("li");
    const btn=document.createElement("button");
    const btnn=document.createElement("button");
    li.innerText=u.email+ " " ;
  btn.innerText="Delete"+ " ";
  btn.dataset.action="delete";
  btn.dataset.id=u.id;
  btnn.innerText="Edit";
  btnn.dataset.action="edit";
  btnn.dataset.id=u.id;
  li.appendChild(btnn);
   li.appendChild(btn);
    userList.appendChild(li);
});
};
userList.addEventListener("click",(event)=>{
    const target=event.target;
    if(target.dataset.action=="delete"){
        del(target.dataset.id);
    }
    if(target.dataset.action=="edit"){
        edit(target.dataset.id);
    }
});
updateUI();
log.addEventListener("click",logFunc);
email.addEventListener("input",diss);
pas.addEventListener("input",diss);
email.addEventListener("input",liv);
pas.addEventListener("input",liv);








