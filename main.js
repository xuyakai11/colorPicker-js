((function(){
  document.onselectstart = function(){return false}

  const R = document.getElementById('RGB-R'),
        G = document.getElementById('RGB-G'),
        B = document.getElementById('RGB-B'),
        saturation = document.getElementById('saturation'),
        hueHorizontal = document.getElementById('hueHorizontal'),
        huePicker = hueHorizontal.children[0],
        hueHorizontalW = +window.getComputedStyle(hueHorizontal,null).width.slice(0,-2),
        rangeStart = ~~hueHorizontal.getBoundingClientRect().x,
        rangeEnd =  rangeStart + hueHorizontalW;

  hueHorizontal.addEventListener('mousedown',down,false)

  function down(e){
    getPosition(e)
    document.documentElement.addEventListener('mousemove',move,false)
    document.documentElement.addEventListener('mouseup',up,false)
  }
  function up(e){
    document.documentElement.removeEventListener('mousemove',move)
    document.documentElement.removeEventListener('mouseup',up)
    getPosition(e)
  }
  function move(e){
    getPosition(e)
  }     

  function getPosition (e) {
    let x = e.clientX;
    x = x > rangeStart
      ? x < rangeEnd 
        ? x
        : rangeEnd
      : rangeStart
    const rate = (x - rangeStart - 2)/hueHorizontalW*100
    huePicker.style.left = rate + '%';
    getRGB((x - rangeStart)/hueHorizontalW*100)
  }
  function getRGB(rate){
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
    const rgb = color[Object.keys(color).filter(v=>+v <= rate).slice(-1)]()
    saturation.style.background = 'rgb('+ rgb.r +', '+ rgb.g +', '+ rgb.b +')'
    // R.value = rgb.r;
    // G.value = rgb.g;
    // B.value = rgb.b;
  }
})())
