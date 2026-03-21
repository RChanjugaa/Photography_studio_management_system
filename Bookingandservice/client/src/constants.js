export const STATUS = { PENDING:"Pending", CONFIRMED:"Confirmed", COMPLETED:"Completed", CANCELLED:"Cancelled" };
export const PKG_TYPES = ["Wedding","Event","Studio","Outdoor"];
export const STATUS_TRANSITIONS = {
  Pending:   ["Confirmed","Cancelled"],
  Confirmed: ["Completed","Cancelled"],
  Completed: [],
  Cancelled: [],
};
export const STATUS_CHIP = {
  Pending:   "bg-blue-50 text-blue-600 border border-blue-200",
  Confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Completed: "bg-teal-50 text-teal-700 border border-teal-200",
  Cancelled: "bg-stone-100 text-stone-500 border border-stone-200",
};
export const STATUS_DOT = {
  Pending:"bg-blue-500", Confirmed:"bg-emerald-500", Completed:"bg-teal-500", Cancelled:"bg-stone-400"
};
export const TYPE_TOP = {
  Wedding:"from-amber-400 to-amber-300", Event:"from-blue-500 to-blue-400",
  Studio:"from-teal-500 to-teal-400",   Outdoor:"from-violet-500 to-violet-400",
};
export const TYPE_BADGE = {
  Wedding:"bg-amber-50 text-amber-700 border border-amber-200",
  Event:"bg-blue-50 text-blue-700 border border-blue-200",
  Studio:"bg-teal-50 text-teal-700 border border-teal-200",
  Outdoor:"bg-violet-50 text-violet-700 border border-violet-200",
};
export const CAL_EVT = {
  Pending:"bg-blue-50 text-blue-600", Confirmed:"bg-emerald-50 text-emerald-700",
  Completed:"bg-teal-50 text-teal-600", Cancelled:"bg-stone-100 text-stone-400",
};
export const TIME_SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
export const IC = "w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white text-stone-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-stone-300";
export const fmtDate = dt => new Date(dt).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
export const fmtTime = dt => new Date(dt).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
export const fmtPrice = n => "LKR " + Number(n||0).toLocaleString();
