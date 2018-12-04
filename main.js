// ((function(){
  document.onselectstart = function(){return false}

  const doc = document.documentElement,
  getElement = function( id ) {
    return document.getElementById(id)
  },
  R = getElement('RGB-R'),
  G = getElement('RGB-G'),
  B = getElement('RGB-B'),
  saturation = getElement('saturation'),
  saturationPointer = getElement('saturationPointer'),
  sbox = saturation.getBoundingClientRect(),

  hueHorizontal = getElement('hueHorizontal'),
  huePicker = hueHorizontal.children[0],
  hbox = hueHorizontal.getBoundingClientRect();

  let type = null,
      box = null,
      locksp = false,
      srgb = {r: 255, g: 255, b: 255},
      hrgb = {r: 255, g: 0, b: 0},
      rateSX = 0,
      rateSY = 0;

  saturation.addEventListener('mousedown',function(e){
    type = 'saturation';
    if(!locksp){
      locksp = true;
    }
    box = sbox;
    down(e);
  },false)
  hueHorizontal.addEventListener('mousedown',function(e){
    type = 'hueHorizontal'
    box = hbox;
    down(e)
  },false)

  function down(e){
    getPosition(e)
    doc.addEventListener('mousemove',move,false)
    doc.addEventListener('mouseup',up,false)
  }
  function up(e){
    doc.removeEventListener('mousemove',move)
    doc.removeEventListener('mouseup',up)
    getPosition(e)
  }
  function move(e){
    getPosition(e)
  }     
  
  function getPosition (e) {
    let x = e.clientX;
    let y = e.clientY;
    
    console.log(box)
    x = x > box.left
    ? x < box.right 
      ? x
      : box.right 
    : box.left

    y = y > box.top
    ? y < box.bottom 
      ? y
      : box.bottom 
    : box.top
    const rateX = (x - box.left)/box.width * 100,
          rateY = (y - box.top)/box.height * 100;
    if(type === 'hueHorizontal'){
      huePicker.style.left = rateX + '%';
      getHRGB(rateX)
    }else{
      saturationPointer.style.cssText += 'left:'+ rateX + '%;top:'+ rateY + '%';
      rateSX = rateX
      rateSY = rateY
      getSRGB()
    }
  }
  function getHRGB(rate) {
    const color = {
      '0': ()=>{
        return {
          r: 255,
          g: ~~(rate/16.67 * 255),
          b: 0
        }
      },
      '16.67': ()=>{
        return {
          r: ~~((33.34 - rate)/16.67 * 255),
          g: 255,
          b: 0
        }
      },
      '33.34': ()=>{
        return {
          r: 0,
          g: 255,
          b: ~~((rate-33.34)/16.67 * 255)
        }
      },
      '50.01': ()=>{
        return {
          r: 0,
          g: ~~((66.68 - rate)/16.67 * 255),
          b: 255
        }
      },
      '66.68': ()=>{
        return {
          r: ~~((rate - 66.68)/16.67 * 255),
          g: 0,
          b: 255
        }
      },
      '83.35': ()=>{
        return {
          r: 255,
          g: 0,
          b: ~~((100 - rate)/16.67 * 255)
        }
      }
    }
    hrgb = color[Object.keys(color).filter(v=>+v <= rate).slice(-1)]()
    saturation.style.background = 'rgb('+ hrgb.r +', '+ hrgb.g +', '+ hrgb.b +')'
    if(rateSX || rateSY){
      getSRGB()
    }
  }
  function getSRGB() {
    console.log(hrgb)
    const m = Object.keys(hrgb).filter(v => {
      return hrgb[v] === 255
    })
    Object.keys(srgb).forEach(v => {
      if(m.indexOf(v) !== -1){
        srgb[v] = ~~(255*(100 - rateSY)/100)
      }else{
        srgb[v] = ~~((srgb[m[0]] + hrgb[v])*(100-rateSX)/100)
      }
    })
    R.value = srgb.r;
    G.value = srgb.g;
    B.value = srgb.b;
  }
// })())
