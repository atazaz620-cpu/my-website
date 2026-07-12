import Link from 'next/link'

export default function LandingPage() {
  return (
    <div style={{background:'#06080f',color:'#F5F0E8',fontFamily:"'Inter',sans-serif",overflowX:'hidden',minHeight:'100vh'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,600&family=Inter:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        @keyframes spinRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes spinRingR{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
        @keyframes shimmer{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes goldShimmer{0%,100%{box-shadow:0 0 20px rgba(212,160,23,0.3),0 0 60px rgba(212,160,23,0.1)}50%{box-shadow:0 0 40px rgba(212,160,23,0.6),0 0 100px rgba(212,160,23,0.2)}}
        @keyframes orb{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.1)}66%{transform:translate(-20px,30px) scale(0.9)}}
        @keyframes pulse{0%,100%{transform:scale(1);opacity:0.5}50%{transform:scale(1.05);opacity:0.9}}
        .f1{animation:fadeUp .8s ease .1s both}.f2{animation:fadeUp .8s ease .3s both}.f3{animation:fadeUp .8s ease .5s both}.f4{animation:fadeUp .8s ease .7s both}.f5{animation:fadeUp .8s ease .9s both}
        .gold-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#B8860B 20%,#F0C040 50%,#B8860B 80%,transparent);background-size:200% auto;animation:shimmer 3s linear infinite;z-index:10}
        .nav-link{color:rgba(245,240,232,0.5);font-size:13px;cursor:pointer;transition:color .2s;text-decoration:none}
        .nav-link:hover{color:#D4A017}
        .ring{position:absolute;border-radius:50%;border-style:solid}
        .ring1{inset:-2px;border-width:1px;border-color:rgba(212,160,23,0.5) transparent rgba(212,160,23,0.5) transparent;animation:spinRing 6s linear infinite}
        .ring2{inset:-18px;border-width:1px;border-color:transparent rgba(212,160,23,0.25) transparent rgba(212,160,23,0.25);animation:spinRingR 9s linear infinite}
        .ring3{inset:-36px;border-width:1px;border-color:rgba(27,43,75,0.5) rgba(212,160,23,0.1) rgba(27,43,75,0.5) rgba(212,160,23,0.1);animation:spinRing 14s linear infinite}
        .ring4{inset:-58px;border-width:1px;border-color:rgba(212,160,23,0.06) transparent rgba(212,160,23,0.06) transparent;animation:spinRingR 20s linear infinite}
        .logo-core{width:200px;height:200px;border-radius:50%;background:linear-gradient(145deg,#F8F4EE,#EDE5D5);border:2px solid rgba(212,160,23,0.3);display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 6px rgba(27,43,75,0.15),0 20px 60px rgba(0,0,0,0.5);animation:goldShimmer 3s ease-in-out infinite,floatY 5s ease-in-out infinite;overflow:hidden;position:relative;z-index:2}
        .feat-card{background:linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:28px 24px;transition:all .3s;position:relative;overflow:hidden}
        .feat-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(184,134,11,0.04),transparent 60%);opacity:0;transition:opacity .3s}
        .feat-card:hover{transform:translateY(-6px) perspective(600px) rotateX(2deg);border-color:rgba(184,134,11,0.2);box-shadow:0 20px 60px rgba(0,0,0,0.3)}
        .feat-card:hover::before{opacity:1}
        .role-card{border-radius:24px;padding:34px 28px;position:relative;overflow:hidden;transition:all .3s}
        .role-card:hover{transform:translateY(-6px) scale(1.01)}
        .hbs-item{padding:20px 28px;border-right:1px solid rgba(184,134,11,0.08);backdrop-filter:blur(16px);background:rgba(6,8,15,0.5);display:flex;align-items:center;gap:14px;transition:background .2s}
        .hbs-item:hover{background:rgba(184,134,11,0.06)}
        .btn-main{padding:16px 40px;border-radius:12px;background:linear-gradient(135deg,#1B2B4B,#243660);color:#fff;font-size:14px;font-weight:600;border:1px solid rgba(212,160,23,0.3);cursor:pointer;box-shadow:0 8px 32px rgba(27,43,75,0.4),inset 0 1px 0 rgba(212,160,23,0.15);transition:all .25s;font-family:'Inter',sans-serif;text-decoration:none;display:inline-block}
        .btn-main:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 14px 44px rgba(27,43,75,0.5)}
        .btn-sec{padding:16px 32px;border-radius:12px;background:rgba(245,240,232,0.04);color:rgba(245,240,232,0.65);font-size:14px;font-weight:400;border:1px solid rgba(245,240,232,0.1);cursor:pointer;backdrop-filter:blur(10px);transition:all .25s;font-family:'Inter',sans-serif;text-decoration:none;display:inline-block}
        .btn-sec:hover{background:rgba(245,240,232,0.08);border-color:rgba(245,240,232,0.2);color:#F5F0E8}
        .btn-cta{padding:18px 56px;border-radius:14px;background:linear-gradient(135deg,#B8860B,#D4A017,#B8860B);background-size:200% auto;color:#fff;font-size:16px;font-weight:700;border:none;cursor:pointer;box-shadow:0 8px 40px rgba(184,134,11,0.4),inset 0 1px 0 rgba(255,255,255,0.2);transition:all .25s;font-family:'Inter',sans-serif;animation:shimmer 3s linear infinite;text-decoration:none;display:inline-block}
        .btn-cta:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 16px 56px rgba(184,134,11,0.6)}
        canvas{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
        @media(max-width:768px){.hero-body-inner{flex-direction:column!important;gap:40px!important}.feat-grid-inner{grid-template-columns:1fr!important}.roles-grid-inner{grid-template-columns:1fr!important}.nav-links-d{display:none!important}}
      `}</style>

      {/* HERO */}
      <div style={{position:'relative',minHeight:'100vh',display:'flex',flexDirection:'column',overflow:'hidden',background:'linear-gradient(135deg,#06080f 0%,#0d1220 40%,#0a0e18 100%)'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(184,134,11,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(184,134,11,0.04) 1px,transparent 1px)',backgroundSize:'60px 60px',pointerEvents:'none',zIndex:1}} />
        <div style={{position:'absolute',width:500,height:500,top:-100,left:-150,borderRadius:'50%',background:'radial-gradient(circle,rgba(27,43,75,0.5),transparent 70%)',filter:'blur(80px)',animation:'orb 14s ease-in-out infinite',pointerEvents:'none'}} />
        <div style={{position:'absolute',width:400,height:400,bottom:-80,right:-100,borderRadius:'50%',background:'radial-gradient(circle,rgba(184,134,11,0.15),transparent 70%)',filter:'blur(80px)',animation:'orb 18s ease-in-out infinite 3s',pointerEvents:'none'}} />
        <div className="gold-line" />
        <canvas id="heroCanvas" />

        {/* NAV */}
        <nav style={{position:'relative',zIndex:10,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 48px',backdropFilter:'blur(20px)',background:'rgba(6,8,15,0.6)',borderBottom:'1px solid rgba(184,134,11,0.1)',animation:'fadeIn .8s ease both'}}>
          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:44,height:44,borderRadius:11,background:'linear-gradient(135deg,#1B2B4B,#2A3F6B)',border:'1px solid rgba(212,160,23,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Cormorant Garamond,serif',fontSize:16,fontWeight:700,color:'#D4A017',boxShadow:'0 4px 20px rgba(27,43,75,0.4)'}}>PA</div>
            <div>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:17,fontWeight:700,color:'#F5F0E8',lineHeight:1.1}}>Pahore Academy</div>
              <div style={{fontSize:10.5,color:'#6B5C42',letterSpacing:'.06em'}}>Mianwali · Est. 2024</div>
            </div>
          </div>
          <div className="nav-links-d" style={{display:'flex',gap:32}}>
            {['Features','Roles','About'].map(l=><a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>)}
          </div>
          <div style={{display:'flex',gap:10}}>
            <Link href="/auth/login" style={{padding:'8px 20px',borderRadius:8,border:'1px solid rgba(245,240,232,0.15)',color:'rgba(245,240,232,0.7)',fontSize:12.5,background:'transparent',textDecoration:'none',transition:'all .2s'}}>Sign In</Link>
            <Link href="/auth/register" style={{padding:'8px 22px',borderRadius:8,background:'linear-gradient(135deg,#B8860B,#D4A017)',color:'#fff',fontSize:12.5,fontWeight:600,border:'none',boxShadow:'0 4px 20px rgba(184,134,11,0.35)',textDecoration:'none',transition:'all .2s'}}>Get Started →</Link>
          </div>
        </nav>

        {/* HERO BODY */}
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 48px',position:'relative',zIndex:2}}>
          <div className="hero-body-inner" style={{display:'flex',alignItems:'center',gap:80,flexWrap:'wrap',justifyContent:'center'}}>
            {/* Logo */}
            <div className="f1" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:24}}>
              <div style={{position:'relative',width:240,height:240,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div className="ring ring1" /><div className="ring ring2" /><div className="ring ring3" /><div className="ring ring4" />
                <div className="logo-core">
                  <img src="/logo.png" alt="Pahore Academy" style={{width:180,height:180,objectFit:'contain',borderRadius:'50%'}} />
                </div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:22,fontWeight:700,color:'#F5F0E8',letterSpacing:'.04em'}}>PAHORE ACADEMY</div>
                <div style={{fontSize:11,color:'#B8860B',letterSpacing:'.18em',textTransform:'uppercase',marginTop:4,fontWeight:500}}>Mianwali · Punjab · Pakistan</div>
              </div>
            </div>

            {/* Text */}
            <div style={{maxWidth:440}}>
              <div className="f1" style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(184,134,11,0.08)',border:'1px solid rgba(184,134,11,0.2)',borderRadius:99,padding:'6px 16px',fontSize:11,fontWeight:500,color:'#D4A017',letterSpacing:'.1em',textTransform:'uppercase',marginBottom:24}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'#D4A017',boxShadow:'0 0 8px rgba(212,160,23,0.8)',animation:'pulse 2s ease-in-out infinite'}} />
                Digital Education Platform
              </div>
              <h1 className="f2" style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(52px,7vw,80px)',fontWeight:700,lineHeight:.92,letterSpacing:'-0.02em',color:'#F5F0E8',marginBottom:6}}>
                Excellence
                <em style={{fontStyle:'italic',fontWeight:300,background:'linear-gradient(135deg,#D4A017,#F0C040,#B8860B)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',animation:'shimmer 4s linear infinite',display:'block'}}>Redefined</em>
              </h1>
              <p className="f3" style={{fontSize:15,color:'rgba(245,240,232,0.5)',lineHeight:1.9,margin:'22px 0 36px',fontWeight:300}}>
                A complete digital management platform — student records, marks tracking, digital library, and AI-powered learning. Built for 3,000+ students of Mianwali.
              </p>
              <div className="f4" style={{display:'flex',gap:14,marginBottom:52,flexWrap:'wrap'}}>
                <Link href="/auth/register" className="btn-main">Join the Academy →</Link>
                <Link href="/auth/login" className="btn-sec">Sign In</Link>
              </div>
              <div className="f5" style={{display:'flex',gap:0}}>
                {[['3,000+','Students'],['14+','Subjects'],['100%','Digital'],['3','Dashboards']].map(([n,l],i,arr)=>(
                  <div key={l} style={{textAlign:'center',padding:'0 24px',borderRight:i<arr.length-1?'1px solid rgba(245,240,232,0.08)':'none'}}>
                    <div id={`stat-${i}`} style={{fontFamily:'Cormorant Garamond,serif',fontSize:32,fontWeight:700,color:'#F5F0E8',lineHeight:1,marginBottom:5}}>{n}</div>
                    <div style={{fontSize:10,color:'rgba(245,240,232,0.3)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:500}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{position:'relative',zIndex:2,display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderTop:'1px solid rgba(184,134,11,0.1)'}}>
          {[['📊','Marks Tracking','Auto grades & analytics'],['📚','Digital Library','Books, notes & PDFs'],['🤖','AI Study Assistant','Powered by Claude AI'],['📈','Analytics','Visual performance']].map(([icon,title,sub])=>(
            <div key={String(title)} className="hbs-item" style={{padding:'20px 28px',borderRight:'1px solid rgba(184,134,11,0.08)',backdropFilter:'blur(16px)',background:'rgba(6,8,15,0.5)',display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:38,height:38,borderRadius:10,background:'linear-gradient(135deg,rgba(27,43,75,0.8),rgba(42,63,107,0.8))',border:'1px solid rgba(212,160,23,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:17,flexShrink:0}}>{icon}</div>
              <div>
                <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:14,fontWeight:600,color:'rgba(245,240,232,0.85)',marginBottom:2}}>{title}</div>
                <div style={{fontSize:11,color:'rgba(245,240,232,0.3)',fontWeight:300}}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" style={{padding:'90px 48px',background:'#06080f',position:'relative'}}>
        <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:600,height:2,background:'linear-gradient(90deg,transparent,rgba(184,134,11,0.4),transparent)'}} />
        <div style={{textAlign:'center',marginBottom:52}}>
          <div style={{fontSize:11,fontWeight:600,color:'#B8860B',letterSpacing:'.18em',textTransform:'uppercase',marginBottom:14}}>Platform Features</div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,4vw,50px)',fontWeight:700,color:'#F5F0E8',marginBottom:8}}>Everything your academy <em style={{fontStyle:'italic',fontWeight:300,color:'#B8860B'}}>needs</em></h2>
          <div style={{width:50,height:2,background:'linear-gradient(90deg,#B8860B,#D4A017)',margin:'0 auto',borderRadius:1}} />
        </div>
        <div className="feat-grid-inner" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18,maxWidth:1100,margin:'0 auto'}}>
          {[['📊','Marks Management','Auto-calculated grades, percentages and performance trends for every student.'],['👤','Student Profiles','Complete records — personal info, class, board and full marks history.'],['📚','Digital Library','Upload & browse PDFs organised by subject, class and board.'],['🤖','AI Study Assistant','Claude AI explains concepts and guides students through curriculum.'],['📈','Analytics & Reports','Class averages, rankings and visual trend analysis.'],['🔐','Multi-Role System','Student + Teacher + Admin roles with a seamless switcher.']].map(([icon,name,desc])=>(
            <div key={String(name)} className="feat-card">
              <div style={{width:50,height:50,borderRadius:14,background:'linear-gradient(135deg,#1B2B4B,#2A3F6B)',border:'1px solid rgba(212,160,23,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,marginBottom:18,boxShadow:'0 4px 16px rgba(27,43,75,0.3)'}}>{icon}</div>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:20,fontWeight:700,color:'#F5F0E8',marginBottom:10}}>{name}</div>
              <div style={{fontSize:13,color:'rgba(245,240,232,0.4)',lineHeight:1.75,fontWeight:300}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ROLES */}
      <div id="roles" style={{padding:'90px 48px',background:'#08090f',position:'relative'}}>
        <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:600,height:1,background:'linear-gradient(90deg,transparent,rgba(184,134,11,0.3),transparent)'}} />
        <div style={{textAlign:'center',marginBottom:52}}>
          <div style={{fontSize:11,fontWeight:600,color:'#B8860B',letterSpacing:'.18em',textTransform:'uppercase',marginBottom:14}}>Access Levels</div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,4vw,50px)',fontWeight:700,color:'#F5F0E8',marginBottom:8}}>Three roles, <em style={{fontStyle:'italic',fontWeight:300,color:'#B8860B'}}>one platform</em></h2>
          <div style={{width:50,height:2,background:'linear-gradient(90deg,#B8860B,#D4A017)',margin:'0 auto',borderRadius:1}} />
        </div>
        <div className="roles-grid-inner" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,maxWidth:1100,margin:'0 auto'}}>
          {[
            {bg:'linear-gradient(145deg,#0f1928,#152338)',border:'1px solid rgba(27,43,75,0.6)',shadow:'0 8px 40px rgba(0,0,0,0.3)',badge:'🎓 Student',bc:'rgba(27,43,75,0.6)',btc:'#7BA3D4',title:'Learn & Track',titleC:'#F5F0E8',sub:'Full academic visibility',subC:'rgba(245,240,232,0.4)',divC:'rgba(27,43,75,0.8)',items:['View complete marks history','Access digital library','AI study assistant','Profile management'],itemC:'rgba(245,240,232,0.5)',checkC:'#7BA3D4'},
            {bg:'linear-gradient(145deg,rgba(245,240,232,0.05),rgba(245,240,232,0.02))',border:'1px solid rgba(245,240,232,0.1)',shadow:'0 8px 40px rgba(0,0,0,0.2)',badge:'📝 Teacher',bc:'rgba(245,240,232,0.06)',btc:'rgba(245,240,232,0.6)',title:'Manage & Report',titleC:'#F5F0E8',sub:'Full classroom control',subC:'rgba(245,240,232,0.35)',divC:'rgba(245,240,232,0.06)',items:['Enter & edit student marks','Class reports & charts','Upload library files','AI marks calculator'],itemC:'rgba(245,240,232,0.45)',checkC:'rgba(245,240,232,0.5)'},
            {bg:'linear-gradient(145deg,#1a0f00,#2a1a00)',border:'1px solid rgba(184,134,11,0.3)',shadow:'0 8px 40px rgba(184,134,11,0.1)',badge:'⚙️ Admin',bc:'rgba(184,134,11,0.15)',btc:'#D4A017',title:'Control & Export',titleC:'#D4A017',sub:'Full system access',subC:'rgba(212,160,23,0.5)',divC:'rgba(184,134,11,0.15)',items:['Full student database','User & role management','Analytics dashboard','Export data as CSV'],itemC:'rgba(212,160,23,0.6)',checkC:'#D4A017'},
          ].map(r=>(
            <div key={r.badge} className="role-card" style={{background:r.bg,border:r.border,boxShadow:r.shadow}}>
              <span style={{display:'inline-block',padding:'5px 14px',borderRadius:99,fontSize:11,fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:22,background:r.bc,color:r.btc,border:`1px solid ${r.btc}33`}}>{r.badge}</span>
              <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:28,fontWeight:700,color:r.titleC,marginBottom:4}}>{r.title}</div>
              <div style={{fontSize:12,color:r.subC,marginBottom:20,fontWeight:300}}>{r.sub}</div>
              <div style={{height:1,background:r.divC,marginBottom:18}} />
              {r.items.map(item=>(
                <div key={item} style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:13,marginBottom:12,color:r.itemC,fontWeight:300}}>
                  <span style={{color:r.checkC,fontSize:11,flexShrink:0,marginTop:1}}>✦</span>{item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div id="about" style={{padding:'100px 48px',background:'#06080f',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 70% 70% at 50% 50%,rgba(27,43,75,0.3) 0%,transparent 70%)'}} />
        <div style={{position:'absolute',width:400,height:400,borderRadius:'50%',border:'1px solid rgba(184,134,11,0.06)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none'}} />
        <div style={{position:'absolute',width:600,height:600,borderRadius:'50%',border:'1px solid rgba(184,134,11,0.03)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none'}} />
        <div style={{position:'relative',zIndex:1}}>
          <div style={{fontSize:11,fontWeight:600,color:'#B8860B',letterSpacing:'.18em',textTransform:'uppercase',marginBottom:14}}>Get Started Today</div>
          <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(36px,6vw,64px)',fontWeight:700,color:'#F5F0E8',lineHeight:1,marginBottom:20}}>
            Ready to go <em style={{fontStyle:'italic',fontWeight:300,color:'#D4A017'}}>digital?</em>
          </h2>
          <p style={{fontSize:15,color:'rgba(245,240,232,0.4)',lineHeight:1.85,marginBottom:44,fontWeight:300,maxWidth:520,margin:'0 auto 44px'}}>
            Join Pahore Academy Mianwali&apos;s digital platform today. Create your account in seconds.
          </p>
          <Link href="/auth/register" className="btn-cta">Create Your Account →</Link>
        </div>
      </div>

      <footer style={{padding:'28px 48px',borderTop:'1px solid rgba(184,134,11,0.1)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#06080f',flexWrap:'wrap',gap:12}}>
        <div style={{fontFamily:'Cormorant Garamond,serif',fontSize:16,fontWeight:700,color:'rgba(245,240,232,0.4)'}}>Pahore Academy Mianwali</div>
        <div style={{fontSize:11.5,color:'rgba(245,240,232,0.2)',letterSpacing:'.04em'}}>© 2024 · All Rights Reserved · Mianwali, Punjab, Pakistan</div>
      </footer>

      <script dangerouslySetInnerHTML={{__html:`
        (function(){
          var canvas=document.getElementById('heroCanvas');
          if(!canvas)return;
          var ctx=canvas.getContext('2d');
          var W,H,particles=[],mouse={x:0,y:0};
          function resize(){var hero=canvas.parentElement;W=canvas.width=hero.offsetWidth;H=canvas.height=hero.offsetHeight;}
          function Particle(){this.reset();}
          Particle.prototype.reset=function(){this.x=Math.random()*W;this.y=Math.random()*H;this.size=Math.random()*1.5+0.3;this.speedX=(Math.random()-.5)*.4;this.speedY=(Math.random()-.5)*.4;this.opacity=Math.random()*.5+.1;this.color=Math.random()>.6?'184,134,11':'27,43,75';this.life=0;this.maxLife=Math.random()*300+200;};
          Particle.prototype.update=function(){this.x+=this.speedX;this.y+=this.speedY;var dx=this.x-mouse.x,dy=this.y-mouse.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<80){this.x+=dx/dist*.8;this.y+=dy/dist*.8;}this.life++;if(this.x<0||this.x>W||this.y<0||this.y>H||this.life>this.maxLife)this.reset();};
          Particle.prototype.draw=function(){ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fillStyle='rgba('+this.color+','+this.opacity+')';ctx.fill();};
          function init(){particles=[];for(var i=0;i<120;i++)particles.push(new Particle());}
          function drawConn(){for(var i=0;i<particles.length;i++){for(var j=i+1;j<particles.length;j++){var dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<100){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle='rgba(184,134,11,'+(1-d/100)*.08+')';ctx.lineWidth=.5;ctx.stroke();}}}}
          function anim(){ctx.clearRect(0,0,W,H);drawConn();particles.forEach(function(p){p.update();p.draw();});requestAnimationFrame(anim);}
          canvas.parentElement.addEventListener('mousemove',function(e){var r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;});
          resize();init();anim();
          window.addEventListener('resize',function(){resize();init();});
        })();
      `}} />
    </div>
  )
}
