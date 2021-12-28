const dhMag = 1.25
const MAT_VALUE_ULTIMA = 36
const MAT_VALUE_OMEGA = 12
const SUBSTATUS_ID = ["meld", "ch", "dh", "det", "ss"]
const MATERIA_ID = ["ch", "dh", "det"]
const GEARSET = ["武器", "頭", "胴", "手", "脚", "足", "耳", "首", "腕", "指1", "指2"]
const GEARSET_ID = {"武器": "weapon", "頭": "head", "胴": "body", "手": "hands", "脚": "legs", "足": "feet", "耳": "earrings", "首": "necklace", "腕": "bracelet", "指1": "rings1", "指2": "rings2"}
const GEARSET_MATERIA_HOLES = {"武器": 2, "頭": 2, "胴": 2, "手": 2, "脚": 2, "足": 2, "耳": 1, "首": 1, "腕": 1, "指1": 1, "指2": 1}
const DEBUG = {"weapon_ch":"177","weapon_dh":"","weapon_det":"253","weapon_ss":"","head_ch":"","head_dh":"154","head_det":"","head_ss":"108","body_ch":"","body_dh":"171","body_det":"244","body_ss":"","hands_ch":"154","hands_dh":"","hands_det":"108","hands_ss":"","legs_ch":"244","legs_dh":"","legs_det":"171","legs_ss":"","feet_ch":"108","feet_dh":"154","feet_det":"","feet_ss":"","earrings_ch":"","earrings_dh":"121","earrings_det":"85","earrings_ss":"","necklace_ch":"121","necklace_dh":"","necklace_det":"85","necklace_ss":"","bracelet_ch":"121","bracelet_dh":"85","bracelet_det":"","bracelet_ss":"","rings1_ch":"","rings1_dh":"85","rings1_det":"121","rings1_ss":"","rings2_ch":"85","rings2_dh":"121","rings2_det":"","rings2_ss":""}

$(function(){
  GEARSET.forEach(str => {
    var ul = $('<ul>').attr('class', 'flex')
    ul.append('<li>'+str+'</li>')
    var len = SUBSTATUS_ID.length
    for(var i=0;i<len;i++){
      if (SUBSTATUS_ID[i] == 'meld') {
        ul.append('<li><input id="'+GEARSET_ID[str]+'_'+SUBSTATUS_ID[i]+'" type="checkbox"></li>')
      } else { 
        ul.append('<li><input id="'+GEARSET_ID[str]+'_'+SUBSTATUS_ID[i]+'" data-gear="'+GEARSET_ID[str]+'" data-substatus="'+SUBSTATUS_ID[i]+'" type="text" size="1"></li>')
      }
    }
    $('#gearset').append(ul)
  });
  $('#meld_all').change(function(){$('#gearset input[type="checkbox"]').prop('checked', $(this).prop('checked'))})
  $('#meld_all').prop('checked', true).change()
  $('#calc_start').click(calcTheoreticalValue)
  $('input').change(calcDirect)
  calcDirect()
  for (key in DEBUG) {
    $('#'+key).val(DEBUG[key])
  }
});
function calcDirect(){
    var ch = $('#ch').val()
    var dh = $('#dh').val()
    var det = $('#det').val()
    var ss = $('#ss').val()
    $('#disp_chrate').html('ch確率<br>'+chRate(ch))
    $('#disp_chmag').html('ch倍率<br>'+chMag(ch))
    $('#disp_dhrate').html('dh確率<br>'+dhRate(dh))
    $('#disp_detmag').html('意思倍率<br>'+detMag(det))
    $('#disp_sstime').html('gcd<br>'+ssTime(ss))
    $('#disp_ssmag').html('ss倍率<br>'+ssMag(ss))
    $('#disp_expmag').html('総合倍率<br>'+round(expMag(ch, dh, det), 3))
}
function chRate(ch) {
  return Math.floor((200*(ch-400)/1900)+50)/1000
}
function chMag(ch) {
  return Math.floor((200*(ch-400)/1900)+1400)/1000
}
function dhRate(dh) {
  return Math.floor(550*(dh-400)/1900)/1000
}
function detMag(det) {
  return (1000+Math.floor(140*(det-390)/1900))/1000
}
function ssTime(ss, gcd) {
  if(!gcd) gcd=2500
  return Math.floor(gcd*(1000+Math.ceil(130*(400-ss)/1900))/10000)/100
}
function ssMag(ss) {
  return (1000+Math.floor(130*(ss-400)/1900))/1000
}
function expMag(ch, dh, det) {
  return ((1 - chRate(ch)) * (1 - dhRate(dh)) +
         dhMag * (1 - chRate(ch)) * dhRate(dh) +
         chMag(ch) * chRate(ch) * (1 - dhRate(dh)) +
         dhMag * chMag(ch) * chRate(ch) * dhRate(dh)) *
         detMag(det)
}
function round(value, base = 0) {
    return Math.round(value * (10**base)) / (10**base);
}
function calcTheoreticalValue() {
  var ind_g = 0
  var ind_m = 0
  var params = {"ch": 400, "dh": 400, "det": 390, "ss": 400}
  var gear_max = {}
  $('#gearset input[type="text"]').each(function(){
    var val = Number($(this).val())
    params[$(this).attr('data-substatus')] += val
    if (!gear_max[$(this).attr('data-gear')] || val > gear_max[$(this).attr('data-gear')]) {
      gear_max[$(this).attr('data-gear')] = val
    }
  });
  var mat_map = {}
  GESRSET.forEach(function(gear){
    if ($('#'+GEARSET_ID[gear]+'_meld').prop('checked')) {
      mat_map[gear]=[0,0,0,0,0]
    } else {
      mat_map[gear]=[0,0]
    }
  })
  var expMagMax = 0 
  rCalc(ind_g, ind_m, params) 
}
function rCalc(ind_g, ind_m) {
  if(ind_g == GEARSET.length-1 && ind_m == mat_map[GEARSET[ind_g]].length-1) {
    var calc_params = Object.assign({}, params)
    for (gear in mat_map) {
      var max = gear_max[gear]
      mat_map[gear].forEach(sub => {
        if (GEARSET_MATERIA_HOLES[gear] >= sub) {
          var add = MAT_VALUE_ULTIMA
        } else {
          var add = MAT_VALUE_OMEGA
        }
        calc_params[SUBSTATUS_ID[sub]] += add
        if (calc_params[SUBSTATUS_ID[sub]] > max) calc_params[SUBSTATUS_ID[sub]] = max
      })
    }
    var exp = expMag(calc_params['ch'], calc_params['dh'], calc_params['det'])
    if (exp > expMagMax) expMagMax = exp
    return
  }
  ind_m++
  if (ind_m >= mat_map[ind_g].length) {
    ind_g++
    ind_m = 0
  }
  rCalc(ind_g, ind_m)
}
