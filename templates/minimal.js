(function() {
  window.templates = window.templates || {};
  window.templates.minimal = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    var st = { font: "'Roboto', sans-serif", align: "left", sectionLine: "0.5px solid #64748b", bg: "#fff", col: "#334155", brand: "#334155" };
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr, buls = window.RT.buls, sh = window.RT.sh;

    var h = '<div style="font-family:' + st.font + ';color:' + st.col + '">';
    h += '<div class="rn" style="text-align:' + st.align + '">' + esc(P.firstName) + (P.lastName ? ' ' + esc(P.lastName) : '') + '</div>';
    if (S.headline) h += '<div class="rtitle" style="text-align:' + st.align + '">' + esc(S.headline) + '</div>';
    
    var ctItems = [];
    SOCIAL_DEFS.forEach(function (sd) {
      if (!S.socialEnabled[sd.key]) return;
      var val = P[sd.key] || ''; if (!val) return;
      ctItems.push(esc(val));
    });
    if (ctItems.length) h += '<div class="ra" style="text-align:' + st.align + ';font-size:9px;margin-bottom:8px">' + ctItems.join(' • ') + '</div>';

    if (P.summary && S.socialEnabled.summary) {
      h += sh('Summary', st);
      h += '<div style="margin-bottom:8px;font-size:10px;text-align:justify">' + linkify(esc(P.summary)) + '</div>';
    }

    S.sectionOrder.forEach(function(secName) {
      if (secName === "Education" && E.length) {
        h += sh('Education', st); 
        E.forEach(function (e) { h += '<div style="margin-bottom:4px"><b>' + esc(e.university) + '</b> - ' + esc(e.degree) + ' (' + esc(dr(e.start, e.end)) + ')</div>'; });
      } else if (secName === "Experience" && X.length) {
        h += sh('Experience', st); 
        X.forEach(function (e) { h += '<div style="margin-bottom:6px"><b>' + esc(e.company) + '</b> | ' + esc(e.role) + ' (' + esc(dr(e.start, e.end)) + ')' + buls(e.bullets) + '</div>'; });
      }
    });
    h += '</div>';
    return h;
  };
})();
