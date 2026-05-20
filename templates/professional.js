(function() {
  window.templates = window.templates || {};
  window.templates.professional = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    var st = { font: "'Playfair Display', serif", align: "center", sectionLine: "2px solid #1e293b", bg: "#fff", col: "#1e293b", brand: "#1e293b" };
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr, buls = window.RT.buls, sh = window.RT.sh;

    var h = '<div style="font-family:' + st.font + ';color:' + st.col + '">';
    h += '<div style="text-align:center;margin-bottom:20px;border-bottom:3px double ' + st.brand + ';padding-bottom:10px">';
    h += '<div style="font-size:32px;font-weight:700;letter-spacing:1px;text-transform:uppercase">' + esc(P.firstName) + (P.lastName ? ' ' + esc(P.lastName) : '') + '</div>';
    if (S.headline) h += '<div style="font-size:14px;font-weight:500;margin-top:4px;color:' + st.brand + '">' + esc(S.headline) + '</div>';
    
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
      }
    });
    h += '</div>';
    return h;
  };
})();
