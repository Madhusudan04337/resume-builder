(function() {
  window.templates = window.templates || {};
  window.templates.professional = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    var brandColor = S.accentColor || "#1e293b";
    var st = { font: "'Playfair Display', serif", align: "center", sectionLine: "2px solid " + brandColor, bg: "#fff", col: "#1e293b", brand: brandColor };
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr, buls = window.RT.buls, sh = window.RT.sh;

    var h = '<div style="font-family:' + st.font + ';color:' + st.col + '">';
    h += '<div style="text-align:center;margin-bottom:20px;border-bottom:3px double ' + st.brand + ';padding-bottom:10px">';
    h += '<div class="rn" style="font-size:32px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:' + st.brand + ';margin-bottom:0px">' + esc(P.firstName) + (P.lastName ? ' ' + esc(P.lastName) : '') + '</div>';
    if (S.headline) h += '<div style="font-size:11px;font-weight:500;font-style:italic;margin-top:6px;color:' + st.brand + ';text-transform:none">' + esc(S.headline) + '</div>';
    
    var ct = [];
    if (P.email && S.socialEnabled.email) ct.push(esc(P.email));
    if (P.phone && S.socialEnabled.phone) ct.push(esc(P.phone));
    if (P.address) ct.push(esc(P.address));
    if (ct.length) h += '<div style="font-size:11px;margin-top:6px;font-family:\'Roboto\', sans-serif">' + ct.join(' • ') + '</div>';
    
    var soc = [];
    if (P.linkedin && S.socialEnabled.linkedin) soc.push('LinkedIn');
    if (P.github && S.socialEnabled.github) soc.push('GitHub');
    if (soc.length) h += '<div style="font-size:10px;margin-top:2px;font-family:\'Roboto\', sans-serif;font-style:italic">' + soc.join(' | ') + '</div>';
    h += '</div>';

    if (P.summary && S.socialEnabled.summary) {
      h += sh('Professional Summary', st);
      h += '<div style="margin-bottom:8px;font-size:10.5px;text-align:justify;line-height:1.5">' + linkify(esc(P.summary)) + '</div>';
    }

    S.sectionOrder.forEach(function(secName) {
      if (secName === "Education" && E.length) {
        h += sh('Education', st); 
        E.forEach(function (e) { h += '<div class="rent"><div class="rrow"><span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(e.university) + '</span><span style="font-weight:500">' + esc(dr(e.start, e.end)) + '</span></div><div class="rrow"><span class="ri" style="color:' + st.brand + ';font-style:italic">' + esc(e.degree) + '</span><span class="ri">' + esc(e.loc) + '</span></div></div>'; });
      } else if (secName === "Experience" && X.length) {
        h += sh('Work Experience', st); 
        X.forEach(function (e) { h += '<div class="rent"><div class="rrow"><span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(e.company) + '</span><span style="font-weight:500">' + esc(dr(e.start, e.end)) + '</span></div><div class="rrow"><span class="ri" style="color:' + st.brand + ';font-style:italic">' + esc(e.role) + '</span><span class="ri">' + esc(e.loc) + '</span></div>' + buls(e.bullets) + '</div>'; });
      } else if (secName === "Projects" && Pr.length) {
        h += sh('Technical Projects', st);
        Pr.forEach(function (p) {
          h += '<div class="rent"><div class="rrow"><span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(p.name) + '</span><span style="font-weight:500">' + esc(p.date) + '</span></div>' +
               (p.tech ? '<div class="ri" style="color:' + st.brand + ';font-style:italic;margin-bottom:2px">' + esc(p.tech) + '</div>' : '') +
               buls(p.bullets) + '</div>';
        });
      } else if (secName === "Skills" && (Sk.languages || Sk.tools || Sk.tech)) {
        h += sh('Skills', st);
        if (Sk.languages) h += '<div style="margin-bottom:2px"><span class="rb" style="font-weight:700">Languages</span>: ' + esc(Sk.languages) + '</div>';
        if (Sk.tools) h += '<div style="margin-bottom:2px"><span class="rb" style="font-weight:700">Developer Tools</span>: ' + esc(Sk.tools) + '</div>';
        if (Sk.tech) h += '<div><span class="rb" style="font-weight:700">Technologies/Frameworks</span>: ' + esc(Sk.tech) + '</div>';
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
          var np = '<span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(c.name) + '</span>';
          var meta = (c.provider ? esc(c.provider) : '') + (dr(c.start, c.end) ? ' (' + esc(dr(c.start, c.end)) + ')' : '');
          h += '<li>• ' + np + (meta ? ' - ' + meta : '') + '</li>';
        });
        h += '</ul></div>';
      } else if (secName === "Leadership" && L && L.length) {
        h += sh('Achievements & Extracurricular', st);
        L.forEach(function (e) {
          h += '<div class="rent"><div class="rrow"><span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(e.org) + '</span><span style="font-weight:500">' + esc(dr(e.start, e.end)) + '</span></div>' +
               '<div class="rrow"><span class="ri" style="color:' + st.brand + ';font-style:italic">' + esc(e.role) + '</span><span class="ri">' + esc(e.loc) + '</span></div>' +
               buls(e.bullets) + '</div>';
        });
      }
    });
    h += '</div>';
    return h;
  };
})();
