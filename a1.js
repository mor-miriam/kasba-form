var WEBHOOK = "https://hook.eu2.make.com/dp86l0szo5xyfretib9mt5fo1mbu3se2";

var SUPPLIERS = {
  kasba:    { name: "Kasba",        type: "מתפרה", group: "group_mm62a5yk", lang: "he" },
  nyi:      { name: "NYI Fabrics",  type: "ייבוא", group: "group_mm5zzdh1", lang: "en" },
  oba:      { name: "OBA Blinds",   type: "ייבוא", group: "group_mm5zzdh1", lang: "en" },
  coulisse: { name: "Coulisse",     type: "ייבוא", group: "group_mm5z66cy", lang: "en" }
};

/* Opaque per-supplier codes used in the public links (no supplier name in the URL).
   Must stay in sync with CODES in build.py. */
var CODES = {
  q7m2k: "kasba",
  v4kdz: "nyi",
  h8rnp: "oba",
  t5xwb: "coulisse"
};

var T = {
  he: {
    title:"הצהרת משלוח", date:"תאריך המשלוח", boxes:"כמה ארגזים סה״כ", boxesPh:"למשל 4",
    add:"הוספת פריט", whatPh:"מספר הזמנה — למשל 1250", qty:"כמות",
    more:"+ ארגז והערה", less:"− הסתרת ארגז והערה", boxPh:"ארגז / שקית", notePh:"הערה לפריט",
    addBtn:"הוספה לרשימה", list:"הרשימה", none:"אין פריטים עדיין",
    empty:"הפריטים שתוסיפו יופיעו כאן, ותוכלו לבדוק אותם לפני השליחה.",
    photo:"צילום תעודת משלוח", photoH:"אופציונלי.", photoBtn:"📷 צילום או בחירת תמונה",
    notes:"הערות", notesH:"משהו שחשוב שנדע? הזמנה שנשארה, בעיה בבד.",
    notesPh:"לדוגמה: הזמנה 1260 תישלח בשבוע הבא.",
    items:"פריטים", line:"שורה", lines:"שורות", review:"סיכום ושליחה",
    sum:"סיכום המשלוח", tot:"סה״כ פריטים", back:"חזרה לעריכה", send:"שליחה", sending:"שולח…",
    doneT:"קיבלנו, תודה", doneP:"ההצהרה נקלטה במערכת של MIRIAM. אם משהו במספרים לא יזוהה — נחזור אליכם.",
    again:"שליחת הצהרה נוספת", boxWord:"ארגזים",
    errEmpty:"צריך למלא מספר הזמנה או תיאור.",
    errSend:"השליחה נכשלה. בדקו חיבור לאינטרנט ונסו שוב."
  },
  en: {
    title:"Shipment Declaration", date:"Shipment date", boxes:"Total boxes", boxesPh:"e.g. 4",
    add:"Add item", whatPh:"Order number — e.g. 1250", qty:"Qty",
    more:"+ box & note", less:"− hide box & note", boxPh:"Box / bag", notePh:"Item note",
    addBtn:"Add to list", list:"The list", none:"No items yet",
    empty:"Items you add will appear here, so you can review them before sending.",
    photo:"Photo of packing list", photoH:"Optional.", photoBtn:"📷 Take or choose a photo",
    notes:"Notes", notesH:"Anything we should know? An order left behind, a fabric issue.",
    notesPh:"e.g. order 1260 will ship next week.",
    items:"items", line:"line", lines:"lines", review:"Review & send",
    sum:"Shipment summary", tot:"Total items", back:"Back to edit", send:"Send", sending:"Sending…",
    doneT:"Received, thank you", doneP:"Your declaration reached MIRIAM. If any number is not recognised we will get back to you.",
    again:"Send another declaration", boxWord:"boxes",
    errEmpty:"Please enter an order number or a description.",
    errSend:"Sending failed. Check your connection and try again."
  }
};

function $(id){ return document.getElementById(id); }
function qp(n){ var m = new RegExp("[?&]"+n+"=([^&]*)").exec(location.search); return m ? decodeURIComponent(m[1]) : ""; }

/* Supplier can arrive as: window.SUP (set by the /<code>/ folder page),
   ?s=<code>, or the legacy ?s=<supplier-name> link. */
var raw = (window.SUP || qp("s") || "").toLowerCase();
var key = CODES[raw] || raw;
var KNOWN = !!SUPPLIERS[key];
var CFG = SUPPLIERS[key] || { name:"", type:"", group:"", lang:"en" };
var L = T[CFG.lang];

document.documentElement.lang = CFG.lang;
document.documentElement.dir  = CFG.lang === "he" ? "rtl" : "ltr";
document.title = CFG.name + " · " + L.title + " · MIRIAM";

$("tTitle").textContent   = L.title;
$("tSup").textContent     = CFG.name;
$("lDate").textContent    = L.date;
$("lBoxes").textContent   = L.boxes;
$("boxes").placeholder    = L.boxesPh;
$("lAdd").textContent     = L.add;
$("what").placeholder     = L.whatPh;
$("lQty").textContent     = L.qty;
$("moreBtn").textContent  = L.more;
$("box").placeholder      = L.boxPh;
$("note").placeholder     = L.notePh;
$("add").textContent      = L.addBtn;
$("lList").textContent    = L.list;
$("empty").textContent    = L.empty;
$("lPhoto").textContent   = L.photo;
$("hPhoto").textContent   = L.photoH;
$("lPhotoBtn").textContent= L.photoBtn;
$("lNotes").textContent   = L.notes;
$("hNotes").textContent   = L.notesH;
$("notes").placeholder    = L.notesPh;
$("lItems").textContent   = L.items;
$("review").textContent   = L.review;
$("lSum").textContent     = L.sum;
$("lTot").textContent     = L.tot;
$("back").textContent     = L.back;
$("send").textContent     = L.send;
$("lDoneT").textContent   = L.doneT;
$("lDoneP").textContent   = L.doneP;
$("again").textContent    = L.again;

if(!KNOWN){
  $("app").style.display = "none";
  $("bar").style.display = "none";
  var w = document.createElement("div");
  w.className = "ns";
  w.textContent = "Please open the personal link that was sent to you. · אנא פתחו את הקישור האישי שנשלח אליכם.";
  document.body.appendChild(w);
}
