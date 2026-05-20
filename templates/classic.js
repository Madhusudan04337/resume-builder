(function() {
  window.templates = window.templates || {};
  window.templates.classic = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    var st = { font: "'Georgia', serif", align: "center", sectionLine: "1.5px solid #000", bg: "#fff", col: "#000", brand: "#000" };
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr, buls = window.RT.buls, sh = window.RT.sh;
    
    var h = '<div style="font-family:' + st.font + ';color:' + st.col + '">';
    h += '<div class="rn" style="text-align:' + st.align + '">' + esc(P.firstName) + (P.lastName ? ' ' + esc(P.lastName) : '') + '</div>';
    if (S.headline) h += '<div class="rtitle" style="text-align:' + st.align + '">' + esc(S.headline) + '</div>';
    if (P.address) h += '<div class="ra" style="text-align:' + st.align + '">' + esc(P.address) + '</div>';
    
    var ctItems = [];
    SOCIAL_DEFS.forEach(function (sd) {
      if (!S.socialEnabled[sd.key]) return;
      var val = P[sd.key] || ''; if (!val) return;
      var href = sd.key === 'email' ? 'mailto:' + val : sd.isLink ? (val.startsWith('http') ? val : sd.prefix + val) : null;
      var ico = '<span style="font-size:9px;font-weight:700;margin-right:2px">' + sd.icon + '</span>';
      ctItems.push('<span style="display:flex;align-items:center;gap:1px">' + ico + (href ? '<a href="' + esc(href) + '" target="_blank" rel="noopener" style="color:#1a0dab;text-decoration:none">' + esc(val) + '</a>' : esc(val)) + '</span>');
    });
    if (ctItems.length) h += '<div class="rc" style="justify-content:' + (st.align === 'center' ? 'center' : 'flex-start') + '">' + ctItems.join('<span style="color:#999;padding:0 2px">|</span>') + '</div>';

    if (P.summary && S.socialEnabled.summary) {
      h += sh('Professional Summary', st);
      h += '<div style="margin-bottom:8px;font-size:10.5px;text-align:justify;line-height:1.5">' + linkify(esc(P.summary)) + '</div>';
    }

    S.sectionOrder.forEach(function(secName) {
      if (secName === "Education" && E.length) {
        h += sh('Education', st); 
        E.forEach(function (e) { h += '<div class="rent"><div class="rrow"><span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(e.university) + '</span><span style="font-weight:500">' + esc(dr(e.start, e.end)) + '</span></div><div class="rrow"><span class="ri" style="color:' + st.brand + ';font-style:italic">' + esc(e.degree) + '</span><span class="ri">' + esc(e.loc) + '</span></div></div>'; });
      } else if (secName === "Coursework") {
        var crs = C.filter(Boolean);
        if (crs.length) { h += sh('Relevant Coursework', st); h += '<div class="rcrs">'; var pc = Math.ceil(crs.length / 4); for (var c = 0; c < 4; c++) { var sl = crs.slice(c * pc, (c + 1) * pc); if (sl.length) h += '<ul>' + sl.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>'; } h += '</div>'; }
      } else if (secName === "Experience" && X.length) {
        h += sh('Work Experience', st); 
        X.forEach(function (e) { h += '<div class="rent"><div class="rrow"><span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(e.company) + '</span><span style="font-weight:500">' + esc(dr(e.start, e.end)) + '</span></div><div class="rrow"><span class="ri" style="color:' + st.brand + ';font-style:italic">' + esc(e.role) + '</span><span class="ri">' + esc(e.loc) + '</span></div>' + buls(e.bullets) + '</div>'; });
      } else if (secName === "Projects" && Pr.length) {
        h += sh('Technical Projects', st); 
        Pr.forEach(function (p) { 
          h += '<div class="rent"><div class="rrow"><span><span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(p.name) + '</span>' + (p.tech ? ' <span class="ri" style="color:' + st.brand + ';font-style:italic">| ' + esc(p.tech) + '</span>' : '') + '</span><span style="font-weight:500">' + esc(p.date) + '</span></div>';
          h += buls(p.bullets) + '</div>'; 
        });
      } else if (secName === "Skills" && (Sk.languages || Sk.tools || Sk.tech)) {
        h += sh('Skills', st); 
        if (Sk.languages) h += '<div><span class="rb">Languages</span>: ' + esc(Sk.languages) + '</div>';
        if (Sk.tools) h += '<div><span class="rb">Developer Tools</span>: ' + esc(Sk.tools) + '</div>'; 
        if (Sk.tech) h += '<div><span class="rb">Technologies/Frameworks</span>: ' + esc(Sk.tech) + '</div>';
      } else if (secName === "Languages" && S.spokenLanguages) {
        h += sh('Languages', st); h += '<div>' + esc(S.spokenLanguages) + '</div>';
      } else if (secName === "Certifications" && Ct && Ct.length) {
        h += sh('Certifications', st); h += '<div class="rcert"><ul>'; Ct.forEach(function (c) { var np = '<span class="rb" style="color:' + st.brand + '">' + esc(c.name) + '</span>'; var meta = (c.provider ? esc(c.provider) : '') + (dr(c.start, c.end) ? ' (' + esc(dr(c.start, e.end)) + ')' : ''); h += '<li>• ' + np + (meta ? ' - ' + meta : ''); h += '</li>'; }); h += '</ul></div>';
      }
    });
    h += '</div>';
    return h;
  };
})();
