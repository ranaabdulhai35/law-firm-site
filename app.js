(function(){
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav scrolled state + progress */
  var hdr = document.getElementById('hdr'), prog = document.getElementById('progress');
  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    hdr.classList.toggle('scrolled', y > 30);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h>0 ? (y/h*100) : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* hero background photo carousel: auto-rotate slides */
  var hcSlides = document.querySelectorAll('.hc-slide');
  if(hcSlides.length && !rm){
    var hci = 0;
    setInterval(function(){
      hcSlides[hci].classList.remove('is-active');
      hci = (hci+1) % hcSlides.length;
      hcSlides[hci].classList.add('is-active');
    }, 5000);
  }

  /* reveal */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('[data-reveal]').forEach(function(el){ io.observe(el); });

  /* count up */
  function animCount(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var suf = el.getAttribute('data-suf')||'';
    var t0=null, dur=1300;
    function tick(t){ if(!t0)t0=t; var p=Math.min((t-t0)/dur,1);
      var e=1-Math.pow(1-p,3);
      el.textContent = Math.round(target*e)+suf;
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ if(e.target.hasAttribute('data-count')&&!rm) animCount(e.target); cio.unobserve(e.target);} });
  },{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ cio.observe(el); });

  /* parallax */
  var pars = [].slice.call(document.querySelectorAll('[data-par]'));
  if(!rm){
    window.addEventListener('scroll', function(){
      var y = window.scrollY;
      pars.forEach(function(el){
        var s = parseFloat(el.getAttribute('data-par'));
        el.style.transform = 'translateY('+(y*s*-1)+'px)';
      });
    }, {passive:true});
  }

  /* ---------- spark particle field ---------- */
  var cv = document.getElementById('sparks'), ctx = cv.getContext('2d');
  var W,H,DPR,parts=[], mouse={x:-999,y:-999};
  function size(){ DPR=Math.min(window.devicePixelRatio||1,2); W=cv.width=innerWidth*DPR; H=cv.height=innerHeight*DPR; cv.style.width=innerWidth+'px'; cv.style.height=innerHeight+'px'; }
  size(); window.addEventListener('resize', size);
  function spawn(){
    var n = innerWidth<760 ? 32 : 64;
    for(var i=0;i<n;i++){
      parts.push({
        x:Math.random()*W, y:Math.random()*H,
        vy:-(.15+Math.random()*.5)*DPR, vx:(Math.random()-.5)*.18*DPR,
        r:(Math.random()*1.5+.4)*DPR, life:Math.random(),
        ember: Math.random()<.32,
        tw:Math.random()*Math.PI*2
      });
    }
  }
  spawn();
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<parts.length;i++){
      var p=parts[i];
      p.x+=p.vx; p.y+=p.vy; p.tw+=0.05;
      // gentle cursor draft
      var dx=p.x-mouse.x*DPR, dy=p.y-mouse.y*DPR, d2=dx*dx+dy*dy;
      if(d2<14000*DPR){ p.x+=dx/2200; p.y+=dy/2200; }
      if(p.y< -10){ p.y=H+10; p.x=Math.random()*W; }
      if(p.x<-10)p.x=W+10; if(p.x>W+10)p.x=-10;
      var a=(0.35+0.45*Math.sin(p.tw))* (p.ember?0.9:0.55);
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,6.283);
      if(p.ember){ ctx.fillStyle='rgba(214,44,44,'+a+')'; ctx.shadowColor='rgba(214,44,44,.8)'; ctx.shadowBlur=8*DPR; }
      else { ctx.fillStyle='rgba(71,10,26,'+(a*0.7)+')'; ctx.shadowBlur=0; }
      ctx.fill(); ctx.shadowBlur=0;
    }
    requestAnimationFrame(draw);
  }
  if(!rm) draw();
  window.addEventListener('mousemove', function(e){ mouse.x=e.clientX; mouse.y=e.clientY; });
  window.addEventListener('mouseleave', function(){ mouse.x=-999; mouse.y=-999; });

  /* smooth-close mobile menu on click */
  document.querySelectorAll('.navlinks a').forEach(function(a){
    a.addEventListener('click', function(){ document.querySelector('.navlinks').classList.remove('open'); });
  });
})();
