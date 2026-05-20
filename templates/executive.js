(function() {
  window.templates = window.templates || {};
  window.templates.executive = function(S, SOCIAL_DEFS) {
    var P = S.personal, E = S.education, C = S.coursework, X = S.experience, Pr = S.projects, Sk = S.skills, L = S.leadership, Ct = S.certifications;
    var st = { font: "'Inter', sans-serif", align: "left", sectionLine: "none", bg: "#fff", col: "#334155", brand: "#0f172a" };
    var esc = window.RT.esc, linkify = window.RT.linkify, dr = window.RT.dr, buls = window.RT.buls, sh = window.RT.sh;

    var sidebar = '<div style="width:32%;background:#f8fafc;padding:25px 15px;border-right:1px solid #e2e8f0;font-size:10px">';
    sidebar += '<div style="width:60px;height:60px;background:' + st.brand + ';color:#fff;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:24px;font-weight:700;margin:0 auto 15px">' + (P.firstName?P.firstName[0]:'') + (P.lastName?P.lastName[0]:'') + '</div>';
    sidebar += '<div style="font-weight:700;color:'+st.brand+';margin-bottom:10px;text-transform:uppercase;letter-spacing:1px">Contact</div>';
    if (P.email && S.socialEnabled.email) sidebar += '<div style="margin-bottom:5px">✉ ' + esc(P.email) + '</div>';
    if (P.phone && S.socialEnabled.phone) sidebar += '<div style="margin-bottom:5px">☎ ' + esc(P.phone) + '</div>';
    if (P.address) sidebar += '<div style="margin-bottom:12px">📍 ' + esc(P.address) + '</div>';
    
    SOCIAL_DEFS.slice(2).forEach(function(sd){
      if (S.socialEnabled[sd.key] && P[sd.key]) sidebar += '<div style="margin-bottom:5px;display:flex;align-items:center;gap:4px"><b>' + sd.icon + '</b> ' + esc(P[sd.key]) + '</div>';
    });

    if (Sk.languages || Sk.tools || Sk.tech) {
      sidebar += '<div style="font-weight:700;color:'+st.brand+';margin:20px 0 10px;text-transform:uppercase;letter-spacing:1px">Skills</div>';
      if (Sk.languages) sidebar += '<div style="margin-bottom:8px"><b>Languages:</b><br>' + esc(Sk.languages) + '</div>';
      if (Sk.tech) sidebar += '<div style="margin-bottom:8px"><b>Tech:</b><br>' + esc(Sk.tech) + '</div>';
    }
    if (S.spokenLanguages) {
      sidebar += '<div style="font-weight:700;color:'+st.brand+';margin:20px 0 10px;text-transform:uppercase;letter-spacing:1px">Languages</div>';
      sidebar += '<div>' + esc(S.spokenLanguages) + '</div>';
    }
    sidebar += '</div>';

    var main = '<div style="flex:1;padding:25px 25px 25px 20px">';
    main += '<div style="font-size:28px;font-weight:800;color:'+st.brand+';margin-bottom:2px">' + esc(P.firstName) + ' ' + esc(P.lastName) + '</div>';
    if (S.headline) main += '<div style="font-size:14px;color:'+st.brand+';opacity:0.8;font-weight:500;margin-bottom:15px">' + esc(S.headline) + '</div>';
    if (P.summary && S.socialEnabled.summary) main += '<div style="font-size:10.5px;line-height:1.5;margin-bottom:20px;text-align:justify">' + linkify(esc(P.summary)) + '</div>';

    S.sectionOrder.forEach(function(secName) {
       if (secName === "Experience" && X.length) {
         main += '<div style="font-weight:700;color:'+st.brand+';border-bottom:2px solid '+st.brand+';margin-bottom:10px;padding-bottom:2px;text-transform:uppercase;font-size:12px">Experience</div>';
         X.forEach(function(e){ main += '<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-weight:700;color:#1e293b"><span>' + esc(e.role) + '</span><span>' + esc(dr(e.start, e.end)) + '</span></div><div style="font-style:italic;color:#64748b;font-size:10px">' + esc(e.company) + ' | ' + esc(e.loc) + '</div>' + buls(e.bullets) + '</div>'; });
       } else if (secName === "Projects" && Pr.length) {
         main += '<div style="font-weight:700;color:'+st.brand+';border-bottom:2px solid '+st.brand+';margin-bottom:10px;padding-bottom:2px;text-transform:uppercase;font-size:12px">Projects</div>';
         Pr.forEach(function(p){ main += '<div style="margin-bottom:10px"><div style="font-weight:700">' + esc(p.name) + ' <span style="font-weight:400;opacity:0.7">| ' + esc(p.tech) + '</span></div>' + buls(p.bullets) + '</div>'; });
       } else if (secName === "Education" && E.length) {
         main += '<div style="font-weight:700;color:'+st.brand+';border-bottom:2px solid '+st.brand+';margin-bottom:10px;padding-bottom:2px;text-transform:uppercase;font-size:12px">Education</div>';
         E.forEach(function(e){ main += '<div style="margin-bottom:8px"><b>' + esc(e.university) + '</b><br>' + esc(e.degree) + ' (' + esc(dr(e.start, e.end)) + ')</div>'; });
       }
    });
    main += '</div>';

    return '<div style="display:flex;font-family:' + st.font + ';color:' + st.col + ';min-height:297mm;margin:-10.6mm -11.9mm">' + sidebar + main + '</div>';
  };
})();
