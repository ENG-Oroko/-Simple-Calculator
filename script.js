const screen = document.getElementById("screen");
const exprLine = document.getElementById("exprLine");
const grid = document.getElementById("grid");
const historyBox = document.getElementById("history");

const toggleBtn = document.getElementById("toggleHistory");
const clearBtn = document.getElementById("clearHistory");

let expr = "";
let history = [];

const keys = [
"AC","⌫","%","/",
"7","8","9","*",
"4","5","6","-",
"1","2","3","+",
"0",".","="
];

keys.forEach(k=>{
  const b=document.createElement("button");
  b.textContent=k;

  if(["/","*","-","+","%"].includes(k))b.className="op";
  if(k==="=")b.className="eq";
  if(k==="AC"||k==="⌫")b.className="danger";
  if(k==="0")b.style.gridColumn="span 2";

  b.onclick=()=>press(k);
  grid.appendChild(b);
});

function update(){
  exprLine.textContent = expr || "0";
  screen.textContent = expr || "0";
}

function renderHistory(){
  historyBox.innerHTML="<strong>History</strong>";

  if(history.length===0){
    historyBox.innerHTML+="<div class='item'>No history</div>";
    return;
  }

  history.slice().reverse().forEach(h=>{
    const d=document.createElement("div");
    d.className="item";
    d.textContent=h;
    d.onclick=()=>{
      expr=h.split("=")[0].trim();
      update();
    };
    historyBox.appendChild(d);
  });
}

function calc(){
  try{
    const old=expr;
    const res=String(Function("return "+expr)());
    exprLine.textContent = old + " =";
    expr = res;
    screen.textContent = res;

    history.push(old+" = "+res);
    if(history.length>20)history.shift();

    renderHistory();
  }catch{
    screen.textContent="Error";
    expr="";
  }
}

function press(k){
  if(k==="AC"){
    expr="";
    update();
    return;
  }

  if(k==="⌫"){
    expr=expr.slice(0,-1);
    update();
    return;
  }

  if(k==="="){
    calc();
    return;
  }

  expr+=k;
  update();
}

// keyboard support
addEventListener("keydown",e=>{
  const k=e.key;

  if(/[0-9.+\-*/%]/.test(k)){
    expr+=k;
    update();
  }
  else if(k==="Enter") calc();
  else if(k==="Backspace"){
    expr=expr.slice(0,-1);
    update();
  }
  else if(k==="Escape"){
    expr="";
    update();
  }
});

// history buttons
toggleBtn.onclick=()=>{
  historyBox.style.display =
    historyBox.style.display==="none"?"block":"none";
};

clearBtn.onclick=()=>{
  history=[];
  renderHistory();
};

renderHistory();
update();