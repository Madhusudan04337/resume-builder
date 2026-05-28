(function() {
  window.templates = window.templates || {};
  window.templates.classic = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    var brandColor = S.accentColor || "#000"; // Black for Classic
    var st = { font: "'Georgia', serif", align: "center", sectionLine: "1.5px solid " + brandColor, bg: "#fff", col: "#000", brand: brandColor };
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr, buls = window.RT.buls, sh = window.RT.sh;
    
    var h = '<div style="font-family:' + st.font + ';color:' + st.col + ';line-height:1.5;font-size:10px">';
    h += '<div class="rn" style="text-align:' + st.align + ';color:' + st.brand + '">' + esc(P.firstName) + (P.lastName ? ' ' + esc(P.lastName) : '') + '</div>';
    if (S.headline) h += '<div class="rtitle" style="text-align:' + st.align + ';font-style:italic;font-size:11px;color:#555;margin-top:4px;text-transform:none">' + esc(S.headline) + '</div>';
    
    var ghIcon = '<svg style="width:10px;height:10px;fill:none;stroke:' + st.brand + ';stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;display:inline-block;vertical-align:middle;margin-right:3px;transform:translateY(-1px)" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>';
    var demoIcon = '<svg style="width:10px;height:10px;fill:' + st.brand + ';display:inline-block;vertical-align:middle;margin-right:3px;transform:translateY(-1px)" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/><path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/></svg>';

    var row1Items = [];
    var row2Items = [];
    // 1. Email
    if (P.email && S.socialEnabled.email) {
      row1Items.push('<span style="display:flex;align-items:center;gap:1px">@ <a href="mailto:' + esc(P.email) + '" style="color:inherit;text-decoration:none">' + esc(P.email) + '</a></span>');
    }
    // 2. Phone
    if (P.phone && S.socialEnabled.phone) {
      row1Items.push('<span style="display:flex;align-items:center;gap:1px">☎ ' + esc(P.phone) + '</span>');
    }
    // 3. Location/Address
    if (P.address) {
      row1Items.push('<span style="display:flex;align-items:center;gap:1px">📍 ' + esc(P.address) + '</span>');
    }
    // 4. Portfolio
    if (P.portfolio && S.socialEnabled.portfolio) {
      var portUrl = P.portfolio.startsWith('http') ? P.portfolio : 'https://' + P.portfolio;
      row1Items.push('<span style="display:flex;align-items:center;gap:1px">⬡ <a href="' + esc(portUrl) + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">' + esc(portUrl.replace(/^https?:\/\//, '')) + '</a></span>');
    }
    // 5. LinkedIn
    if (P.linkedin && S.socialEnabled.linkedin) {
      var liUrl = P.linkedin.startsWith('http') ? P.linkedin : 'https://linkedin.com/in/' + P.linkedin;
      row2Items.push('<span style="display:flex;align-items:center;gap:1px">in <a href="' + esc(liUrl) + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">' + esc(P.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')) + '</a></span>');
    }
    // 6. GitHub
    if (P.github && S.socialEnabled.github) {
      var ghUrl = P.github.startsWith('http') ? P.github : 'https://github.com/' + P.github;
      row2Items.push('<span style="display:flex;align-items:center;gap:1px">GH <a href="' + esc(ghUrl) + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">' + esc(P.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')) + '</a></span>');
    }
    // Other socials
    SOCIAL_DEFS.forEach(function (sd) {
      if (['email', 'phone', 'linkedin', 'github', 'portfolio'].indexOf(sd.key) !== -1) return;
      if (!S.socialEnabled[sd.key]) return;
      var val = P[sd.key] || ''; if (!val) return;
      var href = sd.isLink ? (val.startsWith('http') ? val : sd.prefix + val) : null;
      var ico = '<span style="font-size:9px;font-weight:700;margin-right:2px">' + sd.icon + '</span>';
      row2Items.push('<span style="display:flex;align-items:center;gap:1px">' + ico + (href ? '<a href="' + esc(href) + '" target="_blank" rel="noopener" style="color:inherit;text-decoration:none">' + esc(val) + '</a>' : esc(val)) + '</span>');
    });

    if (row1Items.length || row2Items.length) {
      h += '<div style="font-size:10px;margin-top:6px;margin-bottom:10px;display:flex;flex-direction:column;gap:4px;align-items:center">';
      if (row1Items.length) {
        h += '  <div class="rc" style="justify-content:center;margin:0">' + row1Items.join('<span style="color:#999;padding:0 4px">|</span>') + '</div>';
      }
      if (row2Items.length) {
        h += '  <div class="rc" style="justify-content:center;margin:0">' + row2Items.join('<span style="color:#999;padding:0 4px">|</span>') + '</div>';
      }
      h += '</div>';
    }

    if (P.summary && S.socialEnabled.summary) {
      h += sh('Professional Summary', st);
      h += '<div style="margin-bottom:6px;font-size:10.5px;text-align:justify;line-height:1.55">' + linkify(esc(P.summary)) + '</div>';
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
          
          var links = [];
          if (p.github) {
            var ghUrl = p.github.startsWith('http') ? p.github : 'https://github.com/' + p.github;
            links.push('<span style="display:inline-flex;align-items:center">' + ghIcon + '<a href="' + esc(ghUrl) + '" target="_blank" style="color:' + st.brand + ';text-decoration:underline;font-weight:600">GitHub Repository</a></span>');
          }
          if (p.demo) {
            var demoUrl = p.demo.startsWith('http') ? p.demo : 'https://' + p.demo;
            links.push('<span style="display:inline-flex;align-items:center">' + demoIcon + '<a href="' + esc(demoUrl) + '" target="_blank" style="color:' + st.brand + ';text-decoration:underline;font-weight:600">Live Demo</a></span>');
          }
          if (links.length) {
            h += '  <div style="font-size:10px;margin-top:2px;margin-bottom:2px;display:flex;gap:0px;justify-content:flex-start">' + links.join('<span style="color:#cccccc;margin:0 6px">|</span>') + '</div>';
          }
          
          h += buls(p.bullets) + '</div>'; 
        });
      } else if (secName === "Skills" && (Sk.languages || Sk.tools || Sk.tech)) {
        h += sh('Skills', st); 
        if (Sk.languages) h += '<div><span class="rb" style="color:' + st.brand + '">Languages</span>: ' + esc(Sk.languages) + '</div>';
        if (Sk.tools) h += '<div><span class="rb" style="color:' + st.brand + '">Developer Tools</span>: ' + esc(Sk.tools) + '</div>'; 
        if (Sk.tech) h += '<div><span class="rb" style="color:' + st.brand + '">Technologies/Frameworks</span>: ' + esc(Sk.tech) + '</div>';
      } else if (secName === "Languages" && S.spokenLanguages) {
        h += sh('Languages', st); h += '<div>' + esc(S.spokenLanguages) + '</div>';

      } else if (secName === "Certifications" && Ct && Ct.length) {
        h += sh('Certifications', st);
        h += '<div class="rcert"><ul>';
        Ct.forEach(function (c) {
          var np = '';
          if (c.url) {
            np = '<a href="' + esc(c.url) + '" target="_blank" style="color:' + st.brand + ';text-decoration:underline;font-weight:600">' + esc(c.name) + '</a>';
          } else {
            np = '<span class="rb" style="color:' + st.brand + '">' + esc(c.name) + '</span>';
          }
          var meta = (c.provider ? esc(c.provider) : '') + (dr(c.start, c.end) ? ' (' + esc(dr(c.start, c.end)) + ')' : '');
          h += '<li>• ' + np + (meta ? ' - ' + meta : '') + '</li>';
        });
        h += '</ul></div>';
      } else if (secName === "Leadership" && L && L.length) {
        h += sh('Achievements & Extracurricular', st);
        L.forEach(function (e) {
          h += '<div class="rent">' +
            '<div class="rrow"><span class="rb" style="color:' + st.brand + ';font-weight:700">' + esc(e.org) + '</span><span style="font-weight:500">' + esc(dr(e.start, e.end)) + '</span></div>' +
            '<div class="rrow"><span class="ri" style="color:' + st.brand + ';font-style:italic">' + esc(e.role) + '</span><span class="ri">' + esc(e.loc) + '</span></div>' +
            buls(e.bullets) +
          '</div>';
        });
      } else if (secName === "References" && S.references) {
        h += sh('References', st);
        h += '<div style="font-size:10px;color:#444;font-style:italic;line-height:1.5">' + linkify(esc(S.references)) + '</div>';
      }
    });
    h += '</div>';
    return h;
  };
})();
