function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  var ColorPicker = VueColorPicker;
  Vue.createApp({
      components: {
          ColorPicker: ColorPicker,
      },
      setup() {
          const color = Vue.reactive({
              pin: "ffd500",
              hue: 50,
              saturation: 100,
              luminosity: 50,
              alpha: 1,
          });
          const information = Vue.reactive({
              username: "mier",
              pin: "ffd500",
              type: "admin",
          });

          return {
              msg: 'information:',
              information,
              color,
              onInput(hue) {
                color.pin = hslToHex(hue, color.saturation, color.luminosity);
                color.hue = hue;
                information.pin = hslToHex(hue, color.saturation, color.luminosity);
            },
            saturationset(saturation) {
              console.log(saturation, Number(saturation.target.value))
              color.saturation = Number(saturation.target.value);
            }
          };
      },
  }).mount('#app');
  let rangeInput = document.getElementById("range");
  container = document.getElementsByClassName("container")[0];  
  brightnessbox = document.getElementsByClassName("brightness-box")[0];  
  rangeInput.addEventListener("input", function() {
    colorget = document.getElementsByClassName("rcp__rotator")[0];
    colorget = colorget.style.transform;
    colorget = Number(colorget.match(/(\d+)/)[0]);
    console.log(colorget, "lol");
    rangeInput.style.filter = "brightness(" + rangeInput.value + "%)";
    brightnessbox.style.background = "#"+hslToHex(colorget, 100, Number(rangeInput.value))+";";
  });