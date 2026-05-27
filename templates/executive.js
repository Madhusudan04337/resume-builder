(function() {
  window.templates = window.templates || {};
  window.templates.executive = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    var brandColor = S.accentColor || "#0f172a";
    var st = { font: "'Inter', sans-serif", align: "left", sectionLine: "none", bg: "#fff", col: "#1e293b", brand: brandColor };
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr, buls = window.RT.buls, sh = window.RT.sh;

    var avatarHTML = '';
    var avatarSize = "90px";
    if (P.photo) {
      avatarHTML = '<div style="width:' + avatarSize + ';height:' + avatarSize + ';margin:0 auto 20px;border-radius:50%;overflow:hidden;border:3px solid ' + st.brand + ';box-shadow:0 4px 12px rgba(15,23,42,0.1);background:#fff;display:flex;align-items:center;justify-content:center"><img src="' + P.photo + '" style="width:100%;height:100%;object-fit:cover;display:block"></div>';
    } else {
      avatarHTML = '<div style="width:' + avatarSize + ';height:' + avatarSize + ';background:' + st.brand + ';color:#fff;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:32px;font-weight:700;margin:0 auto 20px;box-shadow:0 4px 12px rgba(15,23,42,0.1)">' + (P.firstName?P.firstName[0]:'') + (P.lastName?P.lastName[0]:'') + '</div>';
    }

    var sidebar = '<div style="width:32%;background:#f8fafc;padding:25px 15px;border-right:1px solid #e2e8f0;font-size:11px;color:' + st.col + ';line-height:1.5">';
    sidebar += avatarHTML;
    sidebar += '<div style="font-weight:700;color:'+st.brand+';margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;font-size:11.5px">Contact</div>';
    
    // Exact ordered contact list: Email, Phone number, Location, Portfolio, LinkedIn, GitHub
    if (P.email && S.socialEnabled.email) sidebar += '<div style="margin-bottom:6px;word-break:break-all">✉ ' + esc(P.email) + '</div>';
    if (P.phone && S.socialEnabled.phone) sidebar += '<div style="margin-bottom:6px">☎ ' + esc(P.phone) + '</div>';
    if (P.address) sidebar += '<div style="margin-bottom:6px">📍 ' + esc(P.address) + '</div>';
    if (P.portfolio && S.socialEnabled.portfolio) {
      var portUrl = P.portfolio.startsWith('http') ? P.portfolio : 'https://' + P.portfolio;
      sidebar += '<div style="margin-bottom:6px;display:flex;align-items:center;gap:4px;word-break:break-all"><b>⬡</b> <a href="' + esc(portUrl) + '" target="_blank" style="color:inherit;text-decoration:none">' + esc(portUrl.replace(/^https?:\/\//, '')) + '</a></div>';
    }
    if (P.linkedin && S.socialEnabled.linkedin) sidebar += '<div style="margin-bottom:6px;display:flex;align-items:center;gap:4px;word-break:break-all"><b>in</b> <a href="' + (P.linkedin.startsWith('http') ? P.linkedin : 'https://linkedin.com/in/' + P.linkedin) + '" target="_blank" style="color:inherit;text-decoration:none">' + esc(P.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')) + '</a></div>';
    if (P.github && S.socialEnabled.github) sidebar += '<div style="margin-bottom:6px;display:flex;align-items:center;gap:4px;word-break:break-all"><b>GH</b> <a href="' + (P.github.startsWith('http') ? P.github : 'https://github.com/' + P.github) + '" target="_blank" style="color:inherit;text-decoration:none">' + esc(P.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')) + '</a></div>';
    
    // Render other enabled socials from SOCIAL_DEFS
    SOCIAL_DEFS.forEach(function(sd){
      if (['email', 'phone', 'linkedin', 'github', 'portfolio'].indexOf(sd.key) !== -1) return;
      if (S.socialEnabled[sd.key] && P[sd.key]) {
        var val = P[sd.key];
        var href = sd.isLink ? (val.startsWith('http') ? val : sd.prefix + val) : null;
        sidebar += '<div style="margin-bottom:6px;display:flex;align-items:center;gap:4px;word-break:break-all"><b>' + sd.icon + '</b> ' + (href ? '<a href="' + esc(href) + '" target="_blank" style="color:inherit;text-decoration:none">' + esc(val) + '</a>' : esc(val)) + '</div>';
      }
    });

    if (Sk.languages || Sk.tools || Sk.tech) {
      sidebar += '<div style="font-weight:700;color:'+st.brand+';margin:22px 0 10px;text-transform:uppercase;letter-spacing:1px;font-size:11.5px">Skills</div>';
      if (Sk.languages) sidebar += '<div style="margin-bottom:10px"><b>Languages:</b><br>' + esc(Sk.languages) + '</div>';
      if (Sk.tools) sidebar += '<div style="margin-bottom:10px"><b>Tools:</b><br>' + esc(Sk.tools) + '</div>';
      if (Sk.tech) sidebar += '<div style="margin-bottom:10px"><b>Tech:</b><br>' + esc(Sk.tech) + '</div>';
    }
    if (S.spokenLanguages) {
      sidebar += '<div style="font-weight:700;color:'+st.brand+';margin:22px 0 10px;text-transform:uppercase;letter-spacing:1px;font-size:11.5px">Languages</div>';
      sidebar += '<div>' + esc(S.spokenLanguages) + '</div>';
    }
    sidebar += '</div>';

    var main = '<div style="flex:1;padding:25px 25px 25px 20px;font-size:11px;line-height:1.5;color:' + st.col + '">';
    main += '<div class="rn" style="font-size:28px;font-weight:800;color:'+st.brand+';margin-bottom:2px">' + esc(P.firstName) + ' ' + esc(P.lastName) + '</div>';
    if (S.headline) main += '<div style="font-style:italic;font-size:11px;color:' + st.brand + ';opacity:0.85;font-weight:500;margin-top:4px;margin-bottom:15px;text-transform:none">' + esc(S.headline) + '</div>';
    if (P.summary && S.socialEnabled.summary) main += '<div style="font-size:11px;line-height:1.5;margin-bottom:20px;text-align:justify">' + linkify(esc(P.summary)) + '</div>';

    S.sectionOrder.forEach(function(secName) {
       if (secName === "Experience" && X.length) {
         main += '<div style="font-weight:700;color:'+st.brand+';border-bottom:2px solid '+st.brand+';margin-bottom:10px;padding-bottom:2px;text-transform:uppercase;font-size:12.5px">Experience</div>';
         X.forEach(function(e){ 
           main += '<div style="margin-bottom:12px">' +
             '<div style="display:flex;justify-content:space-between;font-weight:700;color:' + st.brand + ';font-size:11.5px"><span>' + esc(e.role) + '</span><span>' + esc(dr(e.start, e.end)) + '</span></div>' +
             '<div style="font-style:italic;color:#475569;font-size:10.5px;margin-top:1px;margin-bottom:4px">' + esc(e.company) + ' | ' + esc(e.loc) + '</div>' + 
             buls(e.bullets) + 
           '</div>'; 
         });
       } else if (secName === "Projects" && Pr.length) {
         main += '<div style="font-weight:700;color:'+st.brand+';border-bottom:2px solid '+st.brand+';margin-bottom:10px;padding-bottom:2px;text-transform:uppercase;font-size:12.5px">Projects</div>';
         Pr.forEach(function(p){ 
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

           main += '<div style="margin-bottom:10px">' +
             '<div style="font-weight:700;font-size:11.5px;color:' + st.brand + '">' + esc(p.name) + (p.tech ? ' <span style="font-weight:500;color:#475569;font-size:10.5px">| ' + esc(p.tech) + '</span>' : '') + '</div>' + 
             linksHTML +
             buls(p.bullets) + 
           '</div>'; 
         });
       } else if (secName === "Education" && E.length) {
         main += '<div style="font-weight:700;color:'+st.brand+';border-bottom:2px solid '+st.brand+';margin-bottom:10px;padding-bottom:2px;text-transform:uppercase;font-size:12.5px">Education</div>';
         E.forEach(function(e){ 
           main += '<div style="margin-bottom:10px">' +
             '<div style="display:flex;justify-content:space-between;font-weight:700;color:' + st.brand + ';font-size:11.5px"><span>' + esc(e.university) + '</span><span>' + esc(dr(e.start, e.end)) + '</span></div>' +
             '<div style="display:flex;justify-content:space-between;font-style:italic;color:#475569;font-size:10.5px;margin-top:1px"><span>' + esc(e.degree) + '</span>' + (e.loc ? '<span style="font-weight:normal;font-style:normal;color:#64748b">' + esc(e.loc) + '</span>' : '') + '</div>' +
           '</div>'; 
         });
       } else if (secName === "Coursework") {
         var crs = C.filter(Boolean);
         if (crs.length) {
           main += '<div style="font-weight:700;color:'+st.brand+';border-bottom:2px solid '+st.brand+';margin-bottom:10px;padding-bottom:2px;text-transform:uppercase;font-size:12.5px">Relevant Coursework</div>';
           main += '<div class="rcrs">';
           var pc = Math.ceil(crs.length / 4);
           for (var c = 0; c < 4; c++) {
             var sl = crs.slice(c * pc, (c + 1) * pc);
             if (sl.length) main += '<ul>' + sl.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>';
           }
           main += '</div>';
         }
       } else if (secName === "Certifications" && Ct && Ct.length) {
         main += '<div style="font-weight:700;color:'+st.brand+';border-bottom:2px solid '+st.brand+';margin-bottom:10px;padding-bottom:2px;text-transform:uppercase;font-size:12.5px">Certifications</div>';
         main += '<div class="rcert" style="margin-bottom:12px"><ul>';
         Ct.forEach(function (c) {
           var np = '';
           if (c.url) {
             np = '<a href="' + esc(c.url) + '" target="_blank" style="color:' + st.brand + ';text-decoration:underline;font-weight:700;font-size:11px">' + esc(c.name) + '</a>';
           } else {
             np = '<span class="rb" style="color:' + st.brand + ';font-weight:700;font-size:11px">' + esc(c.name) + '</span>';
           }
           var meta = (c.provider ? esc(c.provider) : '') + (dr(c.start, c.end) ? ' (' + esc(dr(c.start, c.end)) + ')' : '');
           main += '<li style="margin-bottom:4px">• ' + np + (meta ? ' - <span style="color:#475569;font-size:10.5px">' + meta + '</span>' : '') + '</li>';
         });
         main += '</ul></div>';
       } else if (secName === "Leadership" && L && L.length) {
         main += '<div style="font-weight:700;color:'+st.brand+';border-bottom:2px solid '+st.brand+';margin-bottom:10px;padding-bottom:2px;text-transform:uppercase;font-size:12.5px">Achievements & Extracurricular</div>';
         L.forEach(function (e) {
           main += '<div style="margin-bottom:12px">' +
             '<div style="display:flex;justify-content:space-between;font-weight:700;color:' + st.brand + ';font-size:11.5px"><span>' + esc(e.org) + '</span><span>' + esc(dr(e.start, e.end)) + '</span></div>' +
             (e.role ? '<div style="font-style:italic;color:#475569;font-size:10.5px;margin-top:1px;margin-bottom:4px">' + esc(e.role) + (e.loc ? ' | ' + esc(e.loc) : '') + '</div>' : '') +
             buls(e.bullets) +
           '</div>';
         });
       }
    });
    main += '</div>';

    return '<div style="display:flex;font-family:' + st.font + ';color:' + st.col + ';min-height:297mm;margin:-10.6mm -11.9mm">' + sidebar + main + '</div>';
  };
})();
