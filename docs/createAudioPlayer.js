
function createAudioPlayerComponent(config) {
  const { title, src, notes, duration, shift, repeat } = config;
  const length = notes.length; 
  const array = []; 
  
  const audio = document.createElement('audio');
  audio.controls = true;
  audio.src = src;
  const div = document.createElement('div');
  div.appendChild(audio); 

  const divScore = document.createElement('div');
  for (let i=0;i<notes.length;i++) {
    const d = document.createElement('div');
    d.style.display = 'inline-block';
    d.style.margin = '1px';
    d.style.borderRadius = '4px';
    d.style.width = '32px';
    d.style.height = d.style.lineHeight = '32px';
    d.style.textAlign = 'center';
    d.style.fontSize = '12px';
    d.style.background = '#eee';
    d.style.verticalAlign = 'top';
    d.innerHTML = notes[i]; 
    array.push(d);
    divScore.appendChild(d); 

    if (i % 4 === 3) {
      const vb = document.createElement('div');
      vb.style.display = 'inline-block';
      vb.style.background = '#333';
      vb.style.margin = '4px 1px';
      vb.style.width = '1px';
      vb.style.height = '26px';
      divScore.appendChild(vb); 
    }
    // Quick hack to break 16 notes in two lines of 8s
    if (i === 7 && notes.length === 16) { divScore.appendChild(document.createElement('br')); }
  }
  div.appendChild(divScore);
  audio.ontimeupdate = function(e) { 
    let ix = Math.floor(( shift+ audio.currentTime)/duration * length * repeat);
    if (repeat === 2 && ix < 16) ix = ix % length;  // assumes length is always 8 to avoid ending the song back to the first quarter
    for (let i=0;i<length ;i++) { array[i].style.background = '#eee'; }
    if (ix>=0 && ix < length) array[ix].style.background = '#f82';
  }
  return div;
}



    
function createAudioPlayer(config) {
  const { divId, title, duration, snips } = config;
  const div = document.createElement('div');
  const divTitle = document.createElement('div');
  divTitle.style.fontSize = '32px';
  divTitle.innerHTML = title;
  div.appendChild(divTitle);

  for (let i=0;i<snips.length;i++) {
    const TITLE = snips[i].title; 
    const DURATION_DISPLAY = (i === 0) ? '00:0'+Math.floor(duration / 60)+':'+ (duration % 60 < 10 ? ('0'+duration%60) : (duration%60) ) : '';   // puts the duration display only on the first snippet !!!
    const LEFT = (100 * snips[i].startInSong/duration)+'%';
    const WIDTH = ((100 * snips[i].duration * snips[i].repeat)/ duration)+'%';

    const strWave = `<div style="width:300px;position:relative;font-size: 11px;height:40px;">
                        <div style="position:absolute;top:0;left:0;">${TITLE}</div>
                        <div style="position:absolute;top:0;right:0;">${DURATION_DISPLAY}</div>
                        <div style="position:absolute;top:20px;left:0;right:0;height:16px;background-image: url(wave.344x16.png);background-size:contain;background-repeat: no-repeat;">
                          <div style="margin-left:${LEFT};width:${WIDTH};height:100%;background:#333;border-radius:5px;opacity:0.5;"></div>
                        </div>
                      </div>`;
    const divWave = document.createElement('div'); // I need to create a divWave wrapper to avoid destroying the listener
    divWave.innerHTML = strWave;                   // https://stackoverflow.com/questions/5113105/manipulating-innerhtml-removes-the-event-handler-of-a-child-element
    div.appendChild(divWave);                      // 
    const child = createAudioPlayerComponent(snips[i]);
    div.appendChild(child); 
    child.style.marginBottom = '10px';
  }
  
  //div.style.padding = '10px';
  //div.style.borderLeft = '2px solid #333';
  // div.style.margin = '0 0 80px 0';

  document.getElementById(divId).appendChild(div);
}