window.RT = {
  esc: function(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); },
  linkify: function(text) {
    if (!text) return "";
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
      var href = url.startsWith("http") ? url : "https://" + url;
      return '<a href="' + href + '" target="_blank" rel="noopener" style="color:#1a0dab;text-decoration:underline">' + url + '</a>';
    });
  },
  dr: function(s, e) { return [s, e].filter(Boolean).join(' – '); },
  buls: function(arr) { 
    if (!arr || !arr.length) return ''; 
    return '<ul class="rbl">' + arr.filter(Boolean).map(function (b) { return '<li>' + window.RT.linkify(window.RT.esc(b)) + '</li>'; }).join('') + '</ul>'; 
  },
  sh: function(label, st) { 
    return '<div class="rsh" style="border-bottom:' + st.sectionLine + ';color:' + st.brand + ';font-weight:700;letter-spacing:-0.01em">' + label + '</div>'; 
  }
};
