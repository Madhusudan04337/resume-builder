(function() {
  window.templates = window.templates || {};
  window.templates.professional = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    var brandColor = S.accentColor || "#1e293b";
    var st = { font: "'Playfair Display', serif", align: "center", sectionLine: "2px solid " + brandColor, bg: "#fff", col: "#1e293b", brand: brandColor };
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr, buls = window.RT.buls, sh = window.RT.sh;

    var h = '<div style="font-family:' + st.font + ';color:' + st.col + '">';
    // Removed bottom double dividing line (changed to border-bottom: none)
    h += '<div style="text-align:center;margin-bottom:20px;border-bottom:none;padding-bottom:10px">';
    h += '<div class="rn" style="font-size:32px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:' + st.brand + ';margin-bottom:0px">' + esc(P.firstName) + (P.lastName ? ' ' + esc(P.lastName) : '') + '</div>';
    if (S.headline) h += '<div style="font-size:11px;font-weight:500;font-style:italic;margin-top:6px;color:' + st.brand + ';text-transform:none">' + esc(S.headline) + '</div>';
    
    var ct = [];
    // 1. Email
    if (P.email && S.socialEnabled.email) {
      ct.push('<a href="mailto:' + esc(P.email) + '" style="color:inherit;text-decoration:none">' + esc(P.email) + '</a>');
    }
    // 2. Phone
    if (P.phone && S.socialEnabled.phone) {
      ct.push(esc(P.phone));
    }
    // 3. Location
    if (P.address) {
      ct.push(esc(P.address));
    }
    // 4. LinkedIn
    if (P.linkedin && S.socialEnabled.linkedin) {
      var liUrl = P.linkedin.startsWith('http') ? P.linkedin : 'https://linkedin.com/in/' + P.linkedin;
      ct.push('<a href="' + esc(liUrl) + '" target="_blank" style="color:inherit;text-decoration:none">LinkedIn</a>');
    }
    // 5. GitHub
    if (P.github && S.socialEnabled.github) {
      var ghUrl = P.github.startsWith('http') ? P.github : 'https://github.com/' + P.github;
      ct.push('<a href="' + esc(ghUrl) + '" target="_blank" style="color:inherit;text-decoration:none">GitHub</a>');
    }
    // Other socials
    SOCIAL_DEFS.forEach(function (sd) {
      if (['email', 'phone', 'linkedin', 'github'].indexOf(sd.key) !== -1) return;
      if (!S.socialEnabled[sd.key]) return;
      var val = P[sd.key] || ''; if (!val) return;
      var href = sd.isLink ? (val.startsWith('http') ? val : sd.prefix + val) : null;
      ct.push(href ? '<a href="' + esc(href) + '" target="_blank" style="color:inherit;text-decoration:none">' + esc(sd.label) + '</a>' : esc(val));
    });

    if (ct.length) h += '<div style="font-size:11px;margin-top:6px;font-family:\'Roboto\', sans-serif">' + ct.join(' • ') + '</div>';
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
          var linksHTML = '';
          if (links.length) {
            linksHTML = '<div style="font-size:10px;margin-top:4px;margin-bottom:4px;display:flex;gap:0px;justify-content:flex-start">' + links.join('<span style="color:#cccccc;margin:0 6px">|</span>') + '</div>';
          }

          h += '<div class="rent"><div class="rrow"><span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(p.name) + '</span><span style="font-weight:500">' + esc(p.date) + '</span></div>' +
               (p.tech ? '<div class="ri" style="color:' + st.brand + ';font-style:italic;margin-bottom:2px">' + esc(p.tech) + '</div>' : '') +
               linksHTML +
               buls(p.bullets) + '</div>';
        });
      } else if (secName === "Skills" && (Sk.languages || Sk.tools || Sk.tech)) {
        h += sh('Skills', st);
        if (Sk.languages) h += '<div style="margin-bottom:2px"><span class="rb" style="font-weight:700;color:' + st.brand + '">Languages</span>: ' + esc(Sk.languages) + '</div>';
        if (Sk.tools) h += '<div style="margin-bottom:2px"><span class="rb" style="font-weight:700;color:' + st.brand + '">Developer Tools</span>: ' + esc(Sk.tools) + '</div>';
        if (Sk.tech) h += '<div><span class="rb" style="font-weight:700;color:' + st.brand + '">Technologies/Frameworks</span>: ' + esc(Sk.tech) + '</div>';
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
