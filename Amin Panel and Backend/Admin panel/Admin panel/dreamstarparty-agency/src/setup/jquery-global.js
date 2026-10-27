import jQuery from "jquery";

if (typeof window !== "undefined") {
  window.jQuery = window.$ = jQuery;
}

export default jQuery;
