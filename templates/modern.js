(function() {
  window.templates = window.templates || {};
  window.templates.modern = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    
    // Custom branding colors
    var iconCol = S.accentColor || "#361d76";
    var brandCol = S.accentColor || "#32166f";
    
    var st = { font: "'Inter', sans-serif", align: "left", sectionLine: "2px solid " + brandCol, bg: "#fff", col: "#1F2937", brand: brandCol };
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr, buls = window.RT.buls, sh = window.RT.sh;

    var h = '<div style="font-family:' + st.font + ';color:' + st.col + '">';
    h += '<div style="margin-bottom:15px">';
    h += '<div class="rn" style="font-size:24px;font-weight:800;color:' + st.brand + ';line-height:1.2;text-transform:uppercase">' + esc(P.firstName) + (P.lastName ? ' ' + esc(P.lastName) : '') + '</div>';
    if (S.headline) h += '<div style="font-style:italic;font-size:11px;color:' + st.brand + ';margin-top:4px;font-weight:500;opacity:0.85;text-transform:none">' + esc(S.headline) + '</div>';
    
    var rows = [[], []];
    // Custom Icon color and link color applied
    if (P.email && S.socialEnabled.email) rows[0].push('<span style="display:inline-flex;align-items:center;gap:4px;color:' + st.brand + '"><svg style="width:11px;height:11px;fill:'+iconCol+'" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><a href="mailto:' + esc(P.email) + '" style="color:'+st.brand+';text-decoration:none;font-weight:500">' + esc(P.email) + '</a></span>');
    if (P.phone && S.socialEnabled.phone) rows[0].push('<span style="display:inline-flex;align-items:center;gap:4px;color:' + st.brand + '"><svg style="width:11px;height:11px;fill:'+iconCol+'" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg><span style="color:'+st.brand+';font-weight:500">' + esc(P.phone) + '</span></span>');
    if (P.address) rows[0].push('<span style="display:inline-flex;align-items:center;gap:4px;color:' + st.brand + '"><svg style="width:11px;height:11px;fill:'+iconCol+'" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg><span style="color:'+st.brand+';font-weight:500">' + esc(P.address) + '</span></span>');
    if (P.portfolio && S.socialEnabled.portfolio) {
      var portUrl = P.portfolio.startsWith('http') ? P.portfolio : 'https://' + P.portfolio;
      rows[0].push('<span style="display:inline-flex;align-items:center;gap:4px;color:' + st.brand + '"><svg style="width:11px;height:11px;fill:'+iconCol+'" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg><a href="' + esc(portUrl) + '" target="_blank" rel="noopener" style="color:'+st.brand+';text-decoration:none;font-weight:500">' + esc(portUrl.replace(/^https?:\/\//, '')) + '</a></span>');
    }
    
    if (P.linkedin && S.socialEnabled.linkedin) rows[1].push('<span style="display:inline-flex;align-items:center;gap:4px;color:' + st.brand + '"><svg style="width:11px;height:11px;fill:'+iconCol+'" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg><a href="' + (P.linkedin.startsWith('http') ? P.linkedin : 'https://linkedin.com/in/' + P.linkedin) + '" style="color:'+st.brand+';text-decoration:none;font-weight:500">' + esc(P.linkedin) + '</a></span>');
    if (P.github && S.socialEnabled.github) rows[1].push('<span style="display:inline-flex;align-items:center;gap:4px;color:' + st.brand + '"><svg style="width:11px;height:11px;fill:'+iconCol+'" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg><a href="' + (P.github.startsWith('http') ? P.github : 'https://github.com/' + P.github) + '" style="color:'+st.brand+';text-decoration:none;font-weight:500">' + esc(P.github) + '</a></span>');
    
    // Other enabled socials
    SOCIAL_DEFS.forEach(function (sd) {
      if (['email', 'phone', 'linkedin', 'github', 'portfolio'].indexOf(sd.key) !== -1) return;
      if (!S.socialEnabled[sd.key]) return;
      var val = P[sd.key] || ''; if (!val) return;
      var href = sd.isLink ? (val.startsWith('http') ? val : sd.prefix + val) : null;
      rows[1].push('<span style="display:inline-flex;align-items:center;gap:4px;color:' + st.brand + '">' + sd.icon + '<a href="' + esc(href) + '" target="_blank" rel="noopener" style="color:'+st.brand+';text-decoration:none;font-weight:500">' + esc(val.replace(/^https?:\/\//, '')) + '</a></span>');
    });

    h += '<div style="font-size:11px;display:flex;flex-direction:column;gap:4px">';
    rows.forEach(function(r) {
      if (r.length) h += '<div style="display:flex;align-items:center;gap:10px">' + r.join('<span style="color:#E2E8F0">|</span>') + '</div>';
    });
    h += '</div></div>';

    if (P.summary && S.socialEnabled.summary) {
      h += sh('Professional Summary', st);
      h += '<div style="margin-bottom:10px;font-size:10.5px;text-align:justify;line-height:1.5">' + linkify(esc(P.summary)) + '</div>';
    }

    S.sectionOrder.forEach(function(secName) {
      if (secName === "Education" && E.length) {
        h += sh('Education', st); 
        E.forEach(function (e) { h += '<div class="rent"><div class="rrow"><span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(e.university) + '</span><span style="font-weight:600">' + esc(dr(e.start, e.end)) + '</span></div><div class="rrow"><span class="ri" style="color:' + st.brand + ';font-style:italic">' + esc(e.degree) + '</span><span class="ri">' + esc(e.loc) + '</span></div></div>'; });
      } else if (secName === "Experience" && X.length) {
        h += sh('Work Experience', st); 
        X.forEach(function (e) { h += '<div class="rent"><div class="rrow"><span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(e.company) + '</span><span style="font-weight:600">' + esc(dr(e.start, e.end)) + '</span></div><div class="rrow"><span class="ri" style="color:' + st.brand + ';font-style:italic">' + esc(e.role) + '</span><span class="ri">' + esc(e.loc) + '</span></div>' + buls(e.bullets) + '</div>'; });
      } else if (secName === "Projects" && Pr.length) {
        h += sh('Technical Projects', st); 
        Pr.forEach(function (p) { 
          h += '<div class="rent"><div class="rrow"><span><span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(p.name) + '</span>' + (p.tech ? ' <span class="ri" style="color:' + st.brand + ';font-style:italic;opacity:0.8">| ' + esc(p.tech) + '</span>' : '') + '</span><span style="font-weight:600">' + esc(p.date) + '</span></div>';
          
          var links = [];
          var ghIcon = '<svg style="width:10px;height:10px;fill:none;stroke:' + st.brand + ';stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;display:inline-block;vertical-align:middle;margin-right:3px;transform:translateY(-1px)" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>';
          var demoIcon = '<svg style="width:10px;height:10px;fill:none;stroke:' + st.brand + ';stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;display:inline-block;vertical-align:middle;margin-right:3px;transform:translateY(-1px)" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';

          if (p.github) {
            var ghUrl = p.github.startsWith('http') ? p.github : 'https://github.com/' + p.github;
            links.push('<span style="display:inline-flex;align-items:center">' + ghIcon + '<a href="' + esc(ghUrl) + '" target="_blank" style="color:' + st.brand + ';text-decoration:underline;font-weight:600">GitHub Repository</a></span>');
          }
          if (p.demo) {
            var demoUrl = p.demo.startsWith('http') ? p.demo : 'https://' + p.demo;
            links.push('<span style="display:inline-flex;align-items:center">' + demoIcon + '<a href="' + esc(demoUrl) + '" target="_blank" style="color:' + st.brand + ';text-decoration:underline;font-weight:600">Live Demo</a></span>');
          }
          if (links.length) {
            h += '  <div style="font-size:10px;margin-top:4px;margin-bottom:4px;display:flex;gap:0px;justify-content:flex-start">' + links.join('<span style="color:#cccccc;margin:0 6px">|</span>') + '</div>';
          }
          
          h += buls(p.bullets) + '</div>'; 
        });
      } else if (secName === "Skills" && (Sk.languages || Sk.tools || Sk.tech)) {
        h += sh('Skills', st); 
        if (Sk.languages) h += '<div style="margin-bottom:2px"><span class="rb" style="color:'+st.brand+'">Languages</span>: ' + esc(Sk.languages) + '</div>';
        if (Sk.tools) h += '<div style="margin-bottom:2px"><span class="rb" style="color:'+st.brand+'">Developer Tools</span>: ' + esc(Sk.tools) + '</div>'; 
        if (Sk.tech) h += '<div><span class="rb" style="color:'+st.brand+'">Technologies</span>: ' + esc(Sk.tech) + '</div>';
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
        h += sh('Languages', st); h += '<div>' + esc(S.spokenLanguages) + '</div>';
      } else if (secName === "Certifications" && Ct && Ct.length) {
        h += sh('Certifications', st);
        h += '<div class="rcert"><ul>';
        Ct.forEach(function (c) {
          var np = '';
          if (c.url) {
            np = '<a href="' + esc(c.url) + '" target="_blank" style="color:' + st.brand + ';text-decoration:underline;font-weight:700">' + esc(c.name) + '</a>';
          } else {
            np = '<span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(c.name) + '</span>';
          }
          var meta = (c.provider ? esc(c.provider) : '') + (dr(c.start, c.end) ? ' (' + esc(dr(c.start, c.end)) + ')' : '');
          h += '<li>• ' + np + (meta ? ' - ' + meta : '') + '</li>';
        });
        h += '</ul></div>';
      } else if (secName === "Leadership" && L && L.length) {
        h += sh('Achievements & Extracurricular', st);
        L.forEach(function (e) {
          h += '<div class="rent"><div class="rrow"><span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(e.org) + '</span><span style="font-weight:600">' + esc(dr(e.start, e.end)) + '</span></div><div class="rrow"><span class="ri" style="color:' + st.brand + ';font-style:italic">' + esc(e.role) + '</span><span class="ri">' + esc(e.loc) + '</span></div>' + buls(e.bullets) + '</div>';
        });
      }
    });
    h += '</div>';
    return h;
  };
})();
