(function(){
  document.querySelectorAll('video[data-blob]').forEach(function(v){
    v.removeAttribute('controls');v.setAttribute('disablepictureinpicture','');v.setAttribute('controlslist','nodownload noremoteplayback noplaybackrate');
    var w=document.createElement('div');w.className='vp';v.parentNode.insertBefore(w,v);w.appendChild(v);
    var b=document.createElement('button');b.className='vbtn';b.setAttribute('aria-label','Reproducir o pausar');b.innerHTML='<span></span>';
    var bar=document.createElement('div');bar.className='vbar';bar.innerHTML='<i></i>';
    var m=document.createElement('button');m.className='vmute';m.textContent='🔊';m.setAttribute('aria-label','Silenciar');
    w.append(b,bar,m);
    var loaded=false;
    function load(cb){
      if(loaded){cb&&cb();return}
      loaded=true;
      fetch(v.dataset.blob).then(function(r){if(!r.ok)throw 0;return r.blob()})
        .then(function(bl){v.src=URL.createObjectURL(bl.type?bl:new Blob([bl],{type:'video/mp4'}));v.load();cb&&cb()})
        .catch(function(){v.src=v.dataset.blob;cb&&cb()});
    }
    b.onclick=function(){ if(!v.src){ b.firstChild.style.opacity=.5; load(function(){v.play()}); } else { v.paused?v.play():v.pause() } };
    v.addEventListener('play',function(){w.classList.add('playing')});
    v.addEventListener('pause',function(){w.classList.remove('playing')});
    v.addEventListener('ended',function(){w.classList.remove('playing')});
    v.addEventListener('timeupdate',function(){if(v.duration)bar.firstChild.style.width=(v.currentTime/v.duration*100)+'%'});
    bar.onclick=function(e){var r=bar.getBoundingClientRect();if(v.duration)v.currentTime=(e.clientX-r.left)/r.width*v.duration};
    m.onclick=function(){v.muted=!v.muted;m.textContent=v.muted?'🔇':'🔊'};
  });
  document.addEventListener('contextmenu',function(e){if(e.target.closest('.vp,video'))e.preventDefault()});
})();
