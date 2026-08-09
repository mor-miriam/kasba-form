
var WEBHOOK = "https://hook.eu2.make.com/dp86l0szo5xyfretib9mt5fo1mbu3se2";
var SUPPLIER = "Kasba";
function $(id){ return document.getElementById(id); }

var items = [];
var photos = [];

var d = new Date();
$("date").value = new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,10);

function setQty(n){ $("qty").value = Math.max(1, n || 1); }
$("plus").onclick  = function(){ setQty(parseInt($("qty").value,10) + 1); };
$("minus").onclick = function(){ setQty(parseInt($("qty").value,10) - 1); };
$("qty").addEventListener("focus", function(){ $("qty").select(); });

$("moreBtn").onclick = function(){
  var e = $("extra");
  e.classList.toggle("on");
  $("moreBtn").textContent = e.classList.contains("on") ? "− הסתרת ארגז והערה" : "+ ארגז והערה";
};

function err(t){
  var m = $("msg");
  m.textContent = t;
  m.classList.add("on");
  setTimeout(function(){ m.classList.remove("on"); }, 3600);
}

function addItem(){
  var v = $("what").value.trim();
  if(!v){ err("צריך למלא מספר הזמנה או תיאור."); $("what").focus(); return; }
  items.push({
    value: v,
    qty:   parseInt($("qty").value,10) || 1,
    box:   $("box").value.trim(),
    note:  $("note").value.trim()
  });
  $("what").value = "";
  setQty(1);
  $("note").value = "";
  render();
  $("what").focus();
}
$("add").onclick = addItem;
$("what").addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); addItem(); } });
$("qty").addEventListener("keydown",  function(e){ if(e.key === "Enter"){ e.preventDefault(); addItem(); } });

function render(){
  var l = $("list");
  l.innerHTML = "";
  items.forEach(function(it, i){
    var meta = [it.box, it.note].filter(Boolean).join(" · ");
    var row = document.createElement("div");
    row.className = "item";
    row.innerHTML =
      '<div class="main"><div class="v"></div>' + (meta ? '<div class="m"></div>' : '') + '</div>' +
      '<div class="q">&times;' + it.qty + '</div>' +
      '<button type="button" class="x" aria-label="הסרה">&times;</button>';
    row.querySelector(".v").textContent = it.value;
    if(meta) row.querySelector(".m").textContent = meta;
    row.querySelector(".x").onclick = function(){ items.splice(i,1); render(); };
    l.appendChild(row);
  });
  var totItems = items.reduce(function(s,x){ return s + x.qty; }, 0);
  $("tItems").textContent = totItems;
  $("tLines").textContent = items.length + (items.length === 1 ? " שורה" : " שורות");
  $("cnt").textContent = items.length ? (items.length + " שורות · " + totItems + " פריטים") : "אין פריטים עדיין";
  $("empty").style.display = items.length ? "none" : "block";
  $("review").disabled = items.length === 0;
}

function compress(file){
  return new Promise(function(res){
    var fr = new FileReader();
    fr.onload = function(e){
      var img = new Image();
      img.onload = function(){
        var max = 1400, w = img.width, h = img.height;
        if(w > max || h > max){ var k = max/Math.max(w,h); w = Math.round(w*k); h = Math.round(h*k); }
        var c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        res(c.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = function(){ res(null); };
      img.src = e.target.result;
    };
    fr.onerror = function(){ res(null); };
    fr.readAsDataURL(file);
  });
}
$("photo").addEventListener("change", function(e){
  var files = [].slice.call(e.target.files, 0, 4);
  var chain = Promise.resolve();
  files.forEach(function(f){
    chain = chain.then(function(){
      return compress(f).then(function(data){
        if(data){ photos.push({ name: f.name || "photo.jpg", data: data }); drawThumbs(); }
      });
    });
  });
  e.target.value = "";
});
function drawThumbs(){
  $("thumbs").innerHTML = "";
  photos.forEach(function(p,i){
    var t = document.createElement("div");
    t.className = "thumb";
    t.innerHTML = '<img src="'+p.data+'"><button type="button">&times;</button>';
    t.querySelector("button").onclick = function(){ photos.splice(i,1); drawThumbs(); };
    $("thumbs").appendChild(t);
  });
}

function openSheet(){
  if(!items.length) return;
  var dt = $("date").value.split("-").reverse().join("/");
  var bx = parseInt($("boxes").value,10) || 0;
  $("sMeta").textContent = SUPPLIER + " · " + dt + (bx ? (" · " + bx + " ארגזים") : "");
  var sl = $("sList");
  sl.innerHTML = "";
  items.forEach(function(it){
    var meta = [it.box, it.note].filter(Boolean).join(" · ");
    var r = document.createElement("div");
    r.className = "r";
    r.innerHTML = '<div class="n"></div><div class="c">&times;' + it.qty + '</div>';
    r.querySelector(".n").textContent = it.value;
    if(meta){ var s = document.createElement("small"); s.textContent = meta; r.querySelector(".n").appendChild(s); }
    sl.appendChild(r);
  });
  $("sTot").textContent = items.reduce(function(s,x){ return s + x.qty; }, 0);
  $("sheet").classList.add("on");
}
$("review").onclick = openSheet;
$("back").onclick = function(){ $("sheet").classList.remove("on"); };
$("sheet").addEventListener("click", function(e){ if(e.target === $("sheet")) $("sheet").classList.remove("on"); });

$("send").onclick = function(){
  var btn = $("send");
  btn.disabled = true;
  btn.textContent = "שולח…";

  var payload = {
    supplier: SUPPLIER,
    date: $("date").value,
    boxes: parseInt($("boxes").value,10) || 0,
    notes: $("notes").value.trim(),
    rows: items,
    totalItems: items.reduce(function(s,x){ return s + x.qty; }, 0),
    totalLines: items.length,
    photos: photos
  };

  fetch(WEBHOOK, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) })
    .then(success)
    .catch(function(){
      fetch(WEBHOOK, { method:"POST", mode:"no-cors", headers:{"Content-Type":"text/plain"}, body: JSON.stringify(payload) })
        .then(success)
        .catch(function(){
          btn.disabled = false;
          btn.textContent = "שליחה";
          $("sheet").classList.remove("on");
          err("השליחה נכשלה. בדקו חיבור לאינטרנט ונסו שוב.");
        });
    });

  function success(){
    $("sheet").classList.remove("on");
    $("app").style.display = "none";
    $("bar").style.display = "none";
    $("done").classList.add("on");
    window.scrollTo(0,0);
  }
};

render();
