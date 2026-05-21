(function() {
  window.templates = window.templates || {};
  window.templates.minimal = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    var sectionLineColor = S.accentColor || "#64748b";
    var brandColor = S.accentColor || "#334155";
    var st = { font: "'Roboto', sans-serif", align: "left", sectionLine: "0.5px solid " + sectionLineColor, bg: "#fff", col: "#334155", brand: brandColor };
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr, buls = window.RT.buls, sh = window.RT.sh;

    var h = '<div style="font-family:' + st.font + ';color:' + st.col + '">';
    h += '<div class="rn" style="text-align:' + st.align + ';color:' + st.brand + ';margin-bottom:0px">' + esc(P.firstName) + (P.lastName ? ' ' + esc(P.lastName) : '') + '</div>';
    if (S.headline) h += '<div class="rtitle" style="text-align:' + st.align + ';font-style:italic;font-size:11px;color:#555;margin-top:4px;text-transform:none">' + esc(S.headline) + '</div>';
    
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
      } else if (secName === "Projects" && Pr.length) {
        h += sh('Projects', st);
        Pr.forEach(function (p) {
          h += '<div style="margin-bottom:6px"><b>' + esc(p.name) + '</b>' + (p.tech ? ' | <i>' + esc(p.tech) + '</i>' : '') + ' (' + esc(p.date) + ')' + buls(p.bullets) + '</div>';
        });
      } else if (secName === "Skills" && (Sk.languages || Sk.tools || Sk.tech)) {
        h += sh('Skills', st);
        if (Sk.languages) h += '<div style="margin-bottom:2px"><b>Languages</b>: ' + esc(Sk.languages) + '</div>';
        if (Sk.tools) h += '<div style="margin-bottom:2px"><b>Tools</b>: ' + esc(Sk.tools) + '</div>';
        if (Sk.tech) h += '<div><b>Technologies</b>: ' + esc(Sk.tech) + '</div>';
      } else if (secName === "Coursework") {
        var crs = C.filter(Boolean);
        if (crs.length) {
          h += sh('Relevant Coursework', st);
          h += '<div class="rcrs">';
          var pc = Math.ceil(crs.length / 4);
          for (var c = 0; c < 4; c++) {
            var sl = crs.slice(c * pc, (c + 1) * pc);
            if (sl.length) h += '<ul>' + sl.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>';
          }
          h += '</div>';
        }
      } else if (secName === "Languages" && S.spokenLanguages) {
        h += sh('Languages', st);
        h += '<div>' + esc(S.spokenLanguages) + '</div>';
      } else if (secName === "Certifications" && Ct && Ct.length) {
        h += sh('Certifications', st);
        h += '<div class="rcert"><ul>';
        Ct.forEach(function (c) {
          var np = '<b>' + esc(c.name) + '</b>';
          var meta = (c.provider ? esc(c.provider) : '') + (dr(c.start, c.end) ? ' (' + esc(dr(c.start, c.end)) + ')' : '');
          h += '<li>• ' + np + (meta ? ' - ' + meta : '') + '</li>';
        });
        h += '</ul></div>';
      } else if (secName === "Leadership" && L && L.length) {
        h += sh('Achievements & Extracurricular', st);
        L.forEach(function (e) {
          h += '<div style="margin-bottom:6px"><b>' + esc(e.org) + '</b> | ' + esc(e.role) + ' (' + esc(dr(e.start, e.end)) + ')' + buls(e.bullets) + '</div>';
        });
      }
    });
    h += '</div>';
    return h;
  };
})();
