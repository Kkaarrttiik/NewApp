import momentImport from "moment";

const moment = momentImport.default ?? momentImport;

if (typeof window !== "undefined") {
  window.moment = moment;
}

export default moment;
