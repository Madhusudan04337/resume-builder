(function() {
  window.templates = window.templates || {};
  window.templates.signature = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    var st = { font: "'Inter', sans-serif", align: "center", sectionLine: "1.2px solid #111", bg: "#fff", col: "#111", brand: "#111", accent: "#2563eb" };
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr, buls = window.RT.buls, sh = window.RT.sh;

    var h = '<div style="font-family:' + st.font + ';color:' + st.col + '">';
    h += '<div style="text-align:center;margin-bottom:18px">';
    h += '<div style="font-size:32px;font-weight:800;color:#000;letter-spacing:-0.5px">' + esc(P.firstName) + ' ' + esc(P.lastName) + '</div>';
    if (S.headline) h += '<div style="font-size:13px;font-weight:600;margin-top:4px">' + esc(S.headline) + '</div>';
    
    var ct = [];
    if (P.email && S.socialEnabled.email) ct.push('<span style="display:inline-flex;align-items:center;gap:4px"><svg style="width:11px;height:11px;fill:'+st.accent+'" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><a href="mailto:'+esc(P.email)+'" style="color:inherit;text-decoration:none">'+esc(P.email)+'</a></span>');
    if (P.phone && S.socialEnabled.phone) ct.push('<span style="display:inline-flex;align-items:center;gap:4px"><svg style="width:11px;height:11px;fill:'+st.accent+'" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>'+esc(P.phone)+'</span>');
    if (P.address) ct.push('<span style="display:inline-flex;align-items:center;gap:4px"><svg style="width:11px;height:11px;fill:'+st.accent+'" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>'+esc(P.address)+'</span>');
    if (ct.length) h += '<div style="font-size:10.5px;margin-top:8px;display:flex;justify-content:center;gap:12px">' + ct.join('<span style="color:#ddd">|</span>') + '</div>';
    
    var soc = [];
    if (P.github && S.socialEnabled.github) soc.push('<span style="display:inline-flex;align-items:center;gap:4px"><svg style="width:11px;height:11px;fill:'+st.accent+'" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg><a href="'+(P.github.startsWith('http')?P.github:'https://github.com/'+P.github)+'" style="color:inherit;text-decoration:none">GitHub Repository</a></span>');
    if (P.linkedin && S.socialEnabled.linkedin) soc.push('<span style="display:inline-flex;align-items:center;gap:4px"><svg style="width:11px;height:11px;fill:'+st.accent+'" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg><a href="'+(P.linkedin.startsWith('http')?P.linkedin:'https://linkedin.com/in/'+P.linkedin)+'" style="color:inherit;text-decoration:none">LinkedIn</a></span>');
    if (soc.length) h += '<div style="font-size:10.5px;margin-top:6px;display:flex;justify-content:center;gap:12px">' + soc.join('<span style="color:#ddd">|</span>') + '</div>';
    h += '</div>';

    if (P.summary && S.socialEnabled.summary) {
      h += sh('Professional Summary', st);
      h += '<div style="margin-bottom:8px;font-size:10.5px;text-align:justify;line-height:1.5">' + linkify(esc(P.summary)) + '</div>';
    }

    S.sectionOrder.forEach(function(secName) {
      if (secName === "Education" && E.length) {
        h += sh('Education', st); 
        E.forEach(function (e) { 
          h += '<div class="rent"><div class="rrow"><span class="rb" style="font-size:11px">' + esc(e.university) + '</span></div>' +
               '<div class="rrow"><span>' + esc(e.degree) + ' (' + esc(dr(e.start, e.end)) + ')</span>' + 
               (e.loc ? '<span class="rb">Percentage: ' + esc(e.loc) + '</span>' : '') + '</div></div>';
        });
      } else if (secName === "Experience" && X.length) {
        h += sh('Work Experience', st); 
        X.forEach(function (e) { 
          h += '<div class="rent"><div class="rrow"><span class="rb" style="font-size:11px">' + esc(e.role) + ' - ' + esc(e.company) + '</span><span class="ri">' + esc(dr(e.start, e.end)) + '</span></div>' +
               (e.loc ? '<div class="ri" style="font-size:9.5px;margin-bottom:2px">' + esc(e.loc) + '</div>' : '') + 
               buls(e.bullets) + '</div>';
        });
      } else if (secName === "Projects" && Pr.length) {
        h += sh('Technical Projects', st); 
        Pr.forEach(function (p) { 
          h += '<div class="rent"><div class="rrow"><span class="rb" style="font-size:11px">' + esc(p.name) + '</span><span class="ri">' + esc(p.date) + '</span></div>' +
               (p.tech ? '<div class="ri" style="font-size:9.5px;margin-bottom:2px">' + esc(p.tech) + '</div>' : '');
          h += buls(p.bullets) + '</div>'; 
        });
      } else if (secName === "Skills" && (Sk.languages || Sk.tools || Sk.tech)) {
        h += sh('Skills', st); 
        if (Sk.languages) h += '<div style="margin-bottom:4px"><span class="rb">Hard Skills</span>: ' + esc(Sk.languages) + (Sk.tech ? ', ' + esc(Sk.tech) : '') + '</div>';
        if (Sk.tools) h += '<div><span class="rb">Soft Skills</span>: ' + esc(Sk.tools) + '</div>'; 
      }
    });
    h += '</div>';
    return h;
  };
})();
