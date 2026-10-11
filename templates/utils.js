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
  url: function(value, fallbackBase) {
    var url = String(value || '').trim();
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    if (/^\/\//.test(url)) return 'https:' + url;
    if (/^www\./i.test(url) || /^[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[\/:?#]|$)/i.test(url)) return 'https://' + url;
    return fallbackBase ? fallbackBase + url.replace(/^\/+/, '') : 'https://' + url;
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
